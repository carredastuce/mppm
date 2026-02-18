import { useState } from 'react'
import { Plus, Users, User } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Job, Transaction } from '../../types'
import JobCard from './JobCard'
import JobForm from './JobForm'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

export default function JobsList() {
  const { state, dispatch } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>()

  // Fallback: si pas de PIN configuré, garder le toggle adulte
  const hasParentSpace = !!state.parentSettings?.pinHash
  const [isAdultMode, setIsAdultMode] = useState(false)

  const availableJobs = state.jobs.filter(job => job.status === 'available')
  const inProgressJobs = state.jobs.filter(job => job.status === 'in_progress')
  const pendingJobs = state.jobs.filter(job => job.status === 'pending_validation')
  const completedJobs = state.jobs.filter(job => job.status === 'completed')

  const handleSubmit = (job: Job) => {
    if (editingJob) {
      dispatch({ type: 'UPDATE_JOB', payload: job })
    } else {
      dispatch({ type: 'ADD_JOB', payload: job })
    }
    handleCloseModal()
  }

  const handleAccept = (jobId: string) => {
    dispatch({ type: 'ACCEPT_JOB', payload: jobId })
  }

  const handleComplete = (jobId: string, transaction: Transaction) => {
    dispatch({ type: 'COMPLETE_JOB', payload: { jobId, transaction } })
  }

  const handleSubmitJob = (jobId: string) => {
    dispatch({ type: 'SUBMIT_JOB', payload: jobId })
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setIsModalOpen(true)
  }

  const handleDelete = (jobId: string) => {
    dispatch({ type: 'DELETE_JOB', payload: jobId })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingJob(undefined)
  }

  const handleAddNew = () => {
    setEditingJob(undefined)
    setIsModalOpen(true)
  }

  // En mode enfant (avec espace parent configuré), pas de création
  const canCreate = hasParentSpace ? false : isAdultMode

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-900">💼 Petits Boulots</h2>

        <div className="flex items-center gap-3">
          {/* Fallback: toggle mode adulte si pas de PIN */}
          {!hasParentSpace && (
            <Button
              variant={isAdultMode ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setIsAdultMode(!isAdultMode)}
              className="flex items-center gap-2"
            >
              {isAdultMode ? <Users size={18} /> : <User size={18} />}
              {isAdultMode ? 'Mode Adulte' : 'Mode Enfant'}
            </Button>
          )}

          {canCreate && (
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus size={20} />
              Proposer un boulot
            </Button>
          )}
        </div>
      </div>

      {/* Message d'info */}
      {hasParentSpace ? (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm font-medium">
            👦 Accepte des boulots pour gagner de l'argent de poche !
          </p>
        </div>
      ) : (
        <div className={`p-4 rounded-lg ${isAdultMode ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
          <p className="text-sm font-medium">
            {isAdultMode
              ? '👨‍👩‍👧‍👦 Mode Adulte : Proposez des petits boulots et gérez-les.'
              : '👦 Mode Enfant : Accepte des boulots pour gagner de l\'argent de poche !'}
          </p>
        </div>
      )}

      {/* Boulots disponibles */}
      {availableJobs.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            ⭐ Boulots disponibles ({availableJobs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onAccept={handleAccept}
                onComplete={handleComplete}
                onSubmit={hasParentSpace ? handleSubmitJob : undefined}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdultMode={canCreate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Boulots en cours */}
      {inProgressJobs.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            ⏳ Boulots en cours ({inProgressJobs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onAccept={handleAccept}
                onComplete={handleComplete}
                onSubmit={hasParentSpace ? handleSubmitJob : undefined}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdultMode={canCreate}
              />
            ))}
          </div>
        </div>
      )}

      {/* En attente de validation */}
      {pendingJobs.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-purple-600 mb-4">
            ⏳ En attente de validation ({pendingJobs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onAccept={handleAccept}
                onComplete={handleComplete}
                onSubmit={handleSubmitJob}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdultMode={canCreate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Boulots terminés */}
      {completedJobs.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            ✅ Boulots terminés ({completedJobs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onAccept={handleAccept}
                onComplete={handleComplete}
                onSubmit={hasParentSpace ? handleSubmitJob : undefined}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdultMode={canCreate}
              />
            ))}
          </div>
        </div>
      )}

      {/* État vide */}
      {state.jobs.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <p className="text-6xl mb-4">💼</p>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Aucun petit boulot
          </p>
          <p className="text-gray-500 mb-6">
            {hasParentSpace
              ? 'Demande à tes parents d\'en proposer dans l\'espace parent !'
              : isAdultMode
                ? 'Proposez des petits boulots pour que votre enfant puisse gagner de l\'argent de poche !'
                : 'Aucun boulot disponible pour le moment. Demande à un adulte d\'en proposer !'}
          </p>
          {canCreate && (
            <Button onClick={handleAddNew}>
              Proposer le premier boulot
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingJob ? 'Modifier le boulot' : 'Proposer un boulot'}
      >
        <JobForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={editingJob}
        />
      </Modal>
    </div>
  )
}
