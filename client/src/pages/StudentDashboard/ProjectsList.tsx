import React, { useState } from 'react'
import { studentService, type Project } from '../../services/student.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'

interface Props {
  projects: Project[]
  onUpdate: () => void
}

export const ProjectsList: React.FC<Props> = ({ projects, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  })
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFormData({ title: '', description: '', link: '' })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await studentService.updateProject(editingId, formData)
      } else {
        await studentService.addProject(formData)
      }
      resetForm()
      onUpdate()
    } catch (err) {
      console.error('Failed to save project:', err)
      alert('Failed to save project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await studentService.deleteProject(id)
      onUpdate()
    } catch (err) {
      console.error('Failed to delete project:', err)
      alert('Failed to delete project. Please try again.')
    }
  }

  const handleEdit = (proj: Project) => {
    setFormData({
      title: proj.title,
      description: proj.description,
      link: proj.link || '',
    })
    setEditingId(proj._id || null)
    setIsAdding(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="dark:text-white">Projects</CardTitle>
          {!isAdding && <Button size="sm" onClick={() => setIsAdding(true)}>Add Project</Button>}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Input
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                rows={3}
                required
              />
            </div>
            <Input
              label="Project Link (optional)"
              name="link"
              value={formData.link}
              onChange={handleChange}
              fullWidth
            />
            <div className="flex space-x-2">
              <Button type="submit" loading={loading}>{editingId ? 'Update' : 'Add'}</Button>
              <Button variant="outline" type="button" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No projects yet</p>
          ) : (
            projects.map((proj) => (
              <div key={proj._id} className="flex justify-between items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{proj.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{proj.description}</p>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View Project
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(proj)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(proj._id!)}>Delete</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectsList