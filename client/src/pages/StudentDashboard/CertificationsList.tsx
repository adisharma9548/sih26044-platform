import React, { useState } from 'react'
import { studentService, type Certification } from '../../services/student.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'

interface Props {
  certifications: Certification[]
  onUpdate: () => void
}

export const CertificationsList: React.FC<Props> = ({ certifications, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    link: '',
  })
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFormData({ name: '', issuer: '', link: '' })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await studentService.updateCertification(editingId, formData)
      } else {
        await studentService.addCertification(formData)
      }
      resetForm()
      onUpdate()
    } catch (err) {
      console.error('Failed to save certification:', err)
      alert('Failed to save certification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    try {
      await studentService.deleteCertification(id)
      onUpdate()
    } catch (err) {
      console.error('Failed to delete certification:', err)
      alert('Failed to delete certification. Please try again.')
    }
  }

  const handleEdit = (cert: Certification) => {
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      link: cert.link || '',
    })
    setEditingId(cert._id || null)
    setIsAdding(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="dark:text-white">Certifications</CardTitle>
          {!isAdding && <Button size="sm" onClick={() => setIsAdding(true)}>Add Certification</Button>}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Input
              label="Certification Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              label="Issuing Organization"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              label="Link (optional)"
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
          {certifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No certifications yet</p>
          ) : (
            certifications.map((cert) => (
              <div key={cert._id} className="flex justify-between items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{cert.issuer}</p>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Verify
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cert)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(cert._id!)}>Delete</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CertificationsList