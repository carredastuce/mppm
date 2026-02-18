import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { CheckCircle, Clock, Trash2, Edit, Star, Hourglass, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Job, Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

interface JobCardProps {
  job: Job
  onAccept: (jobId: string) => void
  onComplete: (jobId: string, transaction: Transaction) => void
  onSubmit?: (jobId: string) => void
  onValidate?: (jobId: string, transaction: Transaction) => void
  onReject?: (jobId: string) => void
  onEdit: (job: Job) => void
  onDelete: (jobId: string) => void
  isAdultMode?: boolean
}

export default function JobCard({
  job,
  onAccept,
  onComplete,
  onSubmit,
  onValidate,
  onReject,
  onEdit,
  onDelete,
  isAdultMode = false
}: JobCardProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleAccept = () => onAccept(job.id)

  const handleSubmit = () => {
    onSubmit?.(job.id)
    setShowSubmitModal(false)
  }

  const handleValidate = () => {
    const transaction: Transaction = {
      id: uuidv4(),
      type: 'income',
      amount: job.reward,
      category: 'Tâches ménagères',
      label: `Petit boulot : ${job.title}`,
      date: new Date().toISOString(),
      notes: job.description,
    }
    onValidate?.(job.id, transaction)
  }

  const handleReject = () => {
    onReject?.(job.id)
  }

  // Legacy: used when no parent space configured
  const handleComplete = () => {
    const transaction: Transaction = {
      id: uuidv4(),
      type: 'income',
      amount: job.reward,
      category: 'Tâches ménagères',
      label: `Petit boulot : ${job.title}`,
      date: new Date().toISOString(),
      notes: job.description,
    }
    onComplete(job.id, transaction)
    setShowCompleteModal(false)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    onDelete(job.id)
    setShowDeleteModal(false)
  }

  const statusConfig = {
    available: {
      label: 'Disponible',
      color: 'bg-success',
      icon: <Star size={18} />,
    },
    in_progress: {
      label: 'En cours',
      color: 'bg-warning',
      icon: <Clock size={18} />,
    },
    pending_validation: {
      label: 'En attente',
      color: 'bg-purple-500',
      icon: <Hourglass size={18} />,
    },
    completed: {
      label: 'Terminé',
      color: 'bg-gray-400',
      icon: <CheckCircle size={18} />,
    },
  }

  const config = statusConfig[job.status]
  const hasParentValidation = !!(onSubmit || onValidate)

  return (
    <>
      <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 ${job.status === 'pending_validation' ? 'border-purple-300' : 'border-gray-100'}`}>
        {/* Badge statut */}
        <div className="flex items-center justify-between mb-3">
          <div className={`${config.color} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
            {config.icon}
            {config.label}
          </div>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(job.reward)}
          </div>
        </div>

        {/* Icône */}
        <div className="text-6xl text-center mb-4">
          {job.icon || '🧹'}
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm text-center mb-4 min-h-[60px]">
          {job.description}
        </p>

        {/* Actions enfant */}
        <div className="space-y-2">
          {job.status === 'available' && !isAdultMode && (
            <Button variant="primary" className="w-full" onClick={handleAccept}>
              Accepter ce boulot
            </Button>
          )}

          {job.status === 'in_progress' && !isAdultMode && (
            hasParentValidation ? (
              <Button
                variant="success"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowSubmitModal(true)}
              >
                <CheckCircle size={18} />
                J'ai terminé !
              </Button>
            ) : (
              <Button
                variant="success"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowCompleteModal(true)}
              >
                <CheckCircle size={18} />
                Marquer comme terminé
              </Button>
            )
          )}

          {job.status === 'pending_validation' && !isAdultMode && (
            <div className="text-center py-2 text-purple-600 text-sm font-medium">
              ⏳ En attente de validation par tes parents
            </div>
          )}

          {/* Actions parent : validation */}
          {isAdultMode && job.status === 'pending_validation' && (
            <div className="flex gap-2">
              <Button
                variant="success"
                size="sm"
                className="flex-1 flex items-center justify-center gap-1"
                onClick={handleValidate}
              >
                <ThumbsUp size={15} />
                Valider
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 flex items-center justify-center gap-1"
                onClick={handleReject}
              >
                <ThumbsDown size={15} />
                Refuser
              </Button>
            </div>
          )}

          {/* Actions parent : modifier/supprimer */}
          {isAdultMode && job.status !== 'completed' && job.status !== 'pending_validation' && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => onEdit(job)}
              >
                <Edit size={16} />
                Modifier
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
                Supprimer
              </Button>
            </div>
          )}

          {isAdultMode && job.status === 'completed' && (
            <Button
              variant="danger"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Modal soumission (enfant) */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Soumettre pour validation"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🙋</div>
            <p className="text-lg mb-2">Tu as bien terminé le boulot ?</p>
            <p className="text-gray-600 mb-4">
              Tes parents devront valider avant que les {formatCurrency(job.reward)} soient ajoutés à ton porte-monnaie.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="success" className="flex-1" onClick={handleSubmit}>
              Oui, j'ai fini !
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowSubmitModal(false)}>
              Pas encore
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal complétion legacy (sans espace parent) */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Boulot terminé !"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg mb-2">Tu as bien terminé le boulot ?</p>
            <p className="text-gray-600 mb-4">
              {formatCurrency(job.reward)} seront ajoutés à ton porte-monnaie !
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="success" className="flex-1" onClick={handleComplete}>
              Oui, c'est fait !
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowCompleteModal(false)}>
              Pas encore
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmation suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer ce boulot"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Supprimer <strong>"{job.title}"</strong> ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" className="flex-1" onClick={confirmDelete}>
              Supprimer
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
