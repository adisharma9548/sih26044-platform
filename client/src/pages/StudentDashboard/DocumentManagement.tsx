import { useRef, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { studentService, type FileMetadata, type StudentProfile } from '../../services/student.service';

interface DocumentManagementProps {
  profile: StudentProfile;
  onUpdate: () => Promise<void> | void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function validateFile(file: File): string | undefined {
  if (!ALLOWED_TYPES.has(file.type)) return 'Only PDF, DOC, and DOCX files are allowed.';
  if (file.size > MAX_FILE_SIZE) return 'Files must be 5 MB or smaller.';
  return undefined;
}

function fileSize(size: number): string {
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentManagement({ profile, onUpdate }: DocumentManagementProps) {
  const resumeInput = useRef<HTMLInputElement>(null);
  const portfolioInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file: File | undefined, type: 'resume' | 'portfolio') => {
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) { setError(validationError); return; }

    try {
      setBusy(true); setError('');
      if (type === 'resume') await studentService.uploadResume(file);
      else await studentService.uploadPortfolioDocument(file);
      await onUpdate();
    } catch {
      setError('Upload failed. Check your Cloudinary configuration and try again.');
    } finally {
      setBusy(false);
      if (type === 'resume' && resumeInput.current) resumeInput.current.value = '';
      if (type === 'portfolio' && portfolioInput.current) portfolioInput.current.value = '';
    }
  };

  const openDocument = async (type: 'resume' | 'portfolio', document?: FileMetadata) => {
    try {
      setBusy(true); setError('');
      const url = await studentService.getDocumentDownloadUrl(type, document?._id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch { setError('Unable to open this document. Please try again.'); }
    finally { setBusy(false); }
  };

  const remove = async (type: 'resume' | 'portfolio', document?: FileMetadata) => {
    if (!window.confirm(`Delete this ${type === 'resume' ? 'resume' : 'portfolio document'}?`)) return;
    try {
      setBusy(true); setError('');
      if (type === 'resume') await studentService.deleteResume();
      else if (document?._id) await studentService.deletePortfolioDocument(document._id);
      await onUpdate();
    } catch { setError('Unable to delete this document. Please try again.'); }
    finally { setBusy(false); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Resume & Portfolio Documents</CardTitle></CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">PDF, DOC, or DOCX only, up to 5 MB. Your documents are stored privately and downloads use a short-lived link.</p>
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>}

        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Resume</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.resume ? `${profile.resume.originalName} · ${fileSize(profile.resume.size)}` : 'No resume uploaded yet'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.resume && <><Button size="sm" variant="outline" disabled={busy} onClick={() => openDocument('resume')}>View</Button><Button size="sm" variant="danger" disabled={busy} onClick={() => remove('resume')}>Delete</Button></>}
                <Button size="sm" disabled={busy} onClick={() => resumeInput.current?.click()}>{profile.resume ? 'Replace' : 'Upload resume'}</Button>
              </div>
            </div>
            <input ref={resumeInput} className="hidden" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => upload(event.target.files?.[0], 'resume')} />
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><p className="font-medium text-gray-900 dark:text-white">Portfolio documents</p><p className="text-sm text-gray-500 dark:text-gray-400">Add up to five case studies, project reports, or work samples.</p></div>
              <Button size="sm" disabled={busy || profile.portfolioDocuments.length >= 5} onClick={() => portfolioInput.current?.click()}>Add document</Button>
            </div>
            <input ref={portfolioInput} className="hidden" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => upload(event.target.files?.[0], 'portfolio')} />
            {profile.portfolioDocuments.length > 0 && <ul className="space-y-2">
              {profile.portfolioDocuments.map((document) => <li key={document._id} className="flex flex-col justify-between gap-2 rounded-md bg-gray-50 p-3 sm:flex-row sm:items-center dark:bg-gray-800"><span className="text-sm text-gray-700 dark:text-gray-200">{document.originalName} · {fileSize(document.size)}</span><span className="flex gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={() => openDocument('portfolio', document)}>View</Button><Button size="sm" variant="danger" disabled={busy} onClick={() => remove('portfolio', document)}>Delete</Button></span></li>)}
            </ul>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
