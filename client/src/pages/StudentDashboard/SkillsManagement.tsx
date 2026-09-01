import React, { useState } from 'react'
import { studentService, type Skill } from '../../services/student.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { Button } from '../../components/common/Button'

interface Props {
  skills: Skill[]
  onUpdate: () => void
}

const categoryOptions = [
  { value: 'Programming', label: 'Programming' },
  { value: 'Design', label: 'Design' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Cloud', label: 'Cloud' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Soft Skills', label: 'Soft Skills' },
  { value: 'Other', label: 'Other' },
]

const levelOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
]

export const SkillsManagement: React.FC<Props> = ({ skills, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    level: 'Beginner',
  })
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFormData({ name: '', category: 'Other', level: 'Beginner' })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await studentService.updateSkill(editingId, formData)
      } else {
        await studentService.addSkill(formData)
      }
      resetForm()
      onUpdate()
    } catch (err: any) {
      console.error('Failed to save skill:', err)
      alert(err.response?.data?.message || 'Failed to save skill. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    try {
      await studentService.deleteSkill(id)
      onUpdate()
    } catch (err) {
      console.error('Failed to delete skill:', err)
      alert('Failed to delete skill. Please try again.')
    }
  }

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    })
    setEditingId(skill._id || null)
    setIsAdding(true)
  }

  const handleVerifyToggle = async (skill: Skill) => {
    try {
      await studentService.updateSkill(skill._id!, { verified: !skill.verified })
      onUpdate()
    } catch (err) {
      console.error('Failed to toggle verification:', err)
      alert('Failed to update verification status.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="dark:text-white">Skills</CardTitle>
          {!isAdding && <Button size="sm" onClick={() => setIsAdding(true)}>Add Skill</Button>}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Input
              label="Skill Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <Select
              label="Category"
              name="category"
              options={categoryOptions}
              value={formData.category}
              onChange={handleChange}
              fullWidth
            />
            <Select
              label="Level"
              name="level"
              options={levelOptions}
              value={formData.level}
              onChange={handleChange}
              fullWidth
            />
            <div className="flex space-x-2">
              <Button type="submit" loading={loading}>{editingId ? 'Update' : 'Add'}</Button>
              <Button variant="outline" type="button" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {skills.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No skills added yet</p>
          ) : (
            skills.map((skill) => (
              <div key={skill._id} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">{skill.category}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">{skill.level}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${skill.verified ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'}`}>
                      {skill.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleVerifyToggle(skill)}>
                    {skill.verified ? 'Unverify' : 'Verify'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(skill)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(skill._id!)}>Delete</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SkillsManagement