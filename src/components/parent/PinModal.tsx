import { useState, useRef, useEffect, useCallback } from 'react'
import { Shield } from 'lucide-react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import { validatePin } from '../../utils/pin'

interface PinModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'setup' | 'login'
  onSubmit: (pin: string) => void
  error?: string | null
}

const PIN_LENGTH = 4
const MAX_ATTEMPTS = 3
const COOLDOWN_SECONDS = 30

export default function PinModal({ isOpen, onClose, mode, onSubmit, error: externalError }: PinModalProps) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [confirmDigits, setConfirmDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [isConfirming, setIsConfirming] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([])

  const error = externalError || internalError

  const resetState = useCallback(() => {
    setDigits(Array(PIN_LENGTH).fill(''))
    setConfirmDigits(Array(PIN_LENGTH).fill(''))
    setIsConfirming(false)
    setInternalError(null)
  }, [])

  useEffect(() => {
    if (isOpen) {
      resetState()
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [isOpen, resetState])

  useEffect(() => {
    if (externalError) {
      setAttempts(prev => prev + 1)
    }
  }, [externalError])

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) {
      setCooldown(COOLDOWN_SECONDS)
      setAttempts(0)
    }
  }, [attempts])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleDigitChange = (
    index: number,
    value: string,
    currentDigits: string[],
    setCurrentDigits: (d: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (cooldown > 0) return

    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...currentDigits]
    newDigits[index] = digit
    setCurrentDigits(newDigits)
    setInternalError(null)

    if (digit && index < PIN_LENGTH - 1) {
      refs.current[index + 1]?.focus()
    }

    if (digit && index === PIN_LENGTH - 1) {
      const pin = newDigits.join('')
      if (validatePin(pin)) {
        if (mode === 'setup' && !isConfirming) {
          setIsConfirming(true)
          setConfirmDigits(Array(PIN_LENGTH).fill(''))
          setTimeout(() => confirmRefs.current[0]?.focus(), 100)
        } else if (mode === 'setup' && isConfirming) {
          const originalPin = digits.join('')
          if (pin === originalPin) {
            onSubmit(pin)
          } else {
            setInternalError('Les codes ne correspondent pas, veuillez réessayer')
            setConfirmDigits(Array(PIN_LENGTH).fill(''))
            setTimeout(() => confirmRefs.current[0]?.focus(), 100)
          }
        } else {
          onSubmit(pin)
          setCurrentDigits(Array(PIN_LENGTH).fill(''))
        }
      }
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    currentDigits: string[],
    setCurrentDigits: (d: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !currentDigits[index] && index > 0) {
      const newDigits = [...currentDigits]
      newDigits[index - 1] = ''
      setCurrentDigits(newDigits)
      refs.current[index - 1]?.focus()
    }
  }

  const renderPinInputs = (
    currentDigits: string[],
    setCurrentDigits: (d: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => (
    <div className="flex gap-3 justify-center">
      {currentDigits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { refs.current[index] = el }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitChange(index, e.target.value, currentDigits, setCurrentDigits, refs)}
          onKeyDown={(e) => handleKeyDown(index, e, currentDigits, setCurrentDigits, refs)}
          disabled={cooldown > 0}
          className="w-14 h-14 text-2xl text-center font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50"
        />
      ))}
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'setup' ? 'Créer un code PIN' : 'Espace Parent'}
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Shield size={32} className="text-indigo-600" />
          </div>
          <p className="text-gray-600">
            {mode === 'setup'
              ? (isConfirming
                ? 'Confirmez votre code PIN'
                : 'Choisissez un code PIN à 4 chiffres pour protéger l\'espace parent')
              : 'Saisissez votre code PIN'}
          </p>
        </div>

        {mode === 'setup' && isConfirming
          ? renderPinInputs(confirmDigits, setConfirmDigits, confirmRefs)
          : renderPinInputs(digits, setDigits, inputRefs)
        }

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">{error}</p>
        )}

        {cooldown > 0 && (
          <p className="text-amber-600 text-sm text-center font-medium">
            Trop de tentatives. Réessayez dans {cooldown}s
          </p>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Annuler
          </Button>
        </div>
      </div>
    </Modal>
  )
}
