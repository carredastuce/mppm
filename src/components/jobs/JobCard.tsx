import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { CheckCircle, Clock, Trash2, Edit, Star } from 'lucide-react'
import { Job, Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

interface JobCardProps {
  job: Job
  onAccept: (jobId: string) => void
  onComplete: (jobId: string, transaction: Transaction) => void
  onEdit: (job: Job) => void
  onDelete: (jobId: string) => void
  isAdultMode?: boolean
}

export default function JobCard({
  job,
  onAccept,
  onComplete,
  onEdit,
  onDelete,
  isAdultMode = false
}: JobCardProps) {
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const handleAccept = () => {
    onAccept(job.id)
  }

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
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ce boulot "${job.title}" ?`)) {
      onDelete(job.id)
    }
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
    completed: {
      label: 'Terminé',
      color: 'bg-gray-400',
      icon: <CheckCircle size={18} />,
    },
  }

  const config = statusConfig[job.status]

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 border-gray-100">
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

        {/* Actions */}
        <div className="space-y-2">
          {job.status === 'available' && !isAdultMode && (
            <Button
              variant="primary"
              className="w-full"
              onClick={handleAccept}
            >
              Accepter ce boulot
            </Button>
          )}

          {job.status === 'in_progress' && !isAdultMode && (
            <Button
              variant="success"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowCompleteModal(true)}
            >
              <CheckCircle size={18} />
              Marquer comme terminé
            </Button>
          )}

          {/* Actions pour l'adulte */}
          {isAdultMode && job.status !== 'completed' && (
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

          {/* Bouton supprimer pour les jobs terminés */}
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

      {/* Modal de confirmation de complétion */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Boulot terminé !"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg mb-2">
              Tu as bien terminé le boulot ?
            </p>
            <p className="text-gray-600 mb-4">
              {formatCurrency(job.reward)} seront ajoutés à ton porte-monnaie !
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="success"
              className="flex-1"
              onClick={handleComplete}
            >
              Oui, c'est fait !
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowCompleteModal(false)}
            >
              Pas encore
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
