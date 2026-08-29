import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

interface Props {
  skills: string[];
}

export const SkillsList: React.FC<Props> = ({ skills }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No skills added yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsList;