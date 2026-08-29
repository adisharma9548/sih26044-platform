import React, { useState } from 'react';
import { studentService, type Education } from '../../services/student.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

interface Props {
  education: Education[];
  onUpdate: () => void;
}

export const EducationList: React.FC<Props> = ({ education, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    year: new Date().getFullYear(),
    score: '',
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({ degree: '', institution: '', year: new Date().getFullYear(), score: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'year' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await studentService.updateEducation(editingId, formData);
      } else {
        await studentService.addEducation(formData);
      }
      resetForm();
      onUpdate();
    } catch (err) {
      console.error('Failed to save education:', err);
      alert('Failed to save education. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    try {
      await studentService.deleteEducation(id);
      onUpdate();
    } catch (err) {
      console.error('Failed to delete education:', err);
      alert('Failed to delete education. Please try again.');
    }
  };

  const handleEdit = (edu: Education) => {
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
      score: edu.score || '',
    });
    setEditingId(edu._id || null);
    setIsAdding(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Education</CardTitle>
          {!isAdding && <Button size="sm" onClick={() => setIsAdding(true)}>Add Education</Button>}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <Input
              label="Degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              label="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              label="Year"
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              label="Score (optional)"
              name="score"
              value={formData.score}
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
          {education.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No education entries yet</p>
          ) : (
            education.map((edu) => (
              <div key={edu._id} className="flex justify-between items-start p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.year} {edu.score && `· ${edu.score}`}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(edu)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(edu._id!)}>Delete</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationList;