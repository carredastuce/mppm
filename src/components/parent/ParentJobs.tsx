import { useState } from 'react'
import { Plus, Briefcase } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Job, Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import JobCard from '../jobs/JobCard'
import JobForm from '../jobs/JobForm'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

export default function ParentJobs() {
  const { state, dispatch } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>()

  const pendingJobs = state.jobs.filter(job => job.status === 'pending_validation')
  const availableJobs = state.jobs.filter(job => job.status === 'available')
  const inProgressJobs = state.jobs.filter(job => job.status === 'in_progress')
  const completedJobs = state.jobs.filter(job => job.status === 'completed')

  const totalCreated = state.jobs.length
  const totalCompleted = completedJobs.length
  const totalEarned = completedJobs.reduce((sum, j) => sum + j.reward, 0)

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

  const handleValidate = (jobId: string, transaction: Transaction) => {
    dispatch({ type: 'VALIDATE_JOB', payload: { jobId, transaction } })
  }

  const handleReject = (jobId: string) => {
    dispatch({ type: 'REJECT_JOB', payload: jobId })
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

  const cardProps = {
    onAccept: handleAccept,
    onComplete: handleComplete,
    onValidate: handleValidate,
    onReject: handleReject,
    onEdit: handleEdit,
    onDelete: handleDelete,
    isAdultMode: true,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalCreated}</p>
          <p className="text-xs text-gray-500">Jobs créés</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">{totalCompleted}</p>
          <p className="text-xs text-gray-500">Validés</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalEarned)}</p>
          <p className="text-xs text-gray-500">Total versé</p>
        </div>
      </div>

      {/* En-tête + bouton ajouter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase size={24} className="text-indigo-600" />
          Gestion des petits boulots
        </h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={20} />
          Proposer un boulot
        </Button>
      </div>

      {/* À valider — section prioritaire */}
      {pendingJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-bold text-purple-700">
              ⏳ En attente de validation ({pendingJobs.length})
            </h3>
            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              Action requise
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingJobs.map((job) => (
              <JobCard key={job.id} job={job} {...cardProps} />
            ))}
          </div>
        </div>
      )}

      {/* Boulots disponibles */}
      {availableJobs.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Disponibles ({availableJobs.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableJobs.map((job) => (
              <JobCard key={job.id} job={job} {...cardProps} />
            ))}
          </div>
        </div>
      )}

      {/* Boulots en cours */}
      {inProgressJobs.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">En cours ({inProgressJobs.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressJobs.map((job) => (
              <JobCard key={job.id} job={job} {...cardProps} />
            ))}
          </div>
        </div>
      )}

      {/* Boulots terminés */}
      {completedJobs.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Validés ({completedJobs.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedJobs.map((job) => (
              <JobCard key={job.id} job={job} {...cardProps} />
            ))}
          </div>
        </div>
      )}

      {/* État vide */}
      {state.jobs.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-semibold text-gray-700 mb-2">Aucun petit boulot</p>
          <p className="text-gray-500 mb-6">Proposez des petits boulots pour motiver votre enfant !</p>
          <Button onClick={handleAddNew}>Proposer le premier boulot</Button>
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
