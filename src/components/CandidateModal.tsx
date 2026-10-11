import React, { useState } from 'react';
import { X, UserPlus, Edit3, Trash2 } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateToEdit?: Candidate | null;
  onSave: (data: {
    name: string;
    age: number;
    status: Candidate['status'];
    occupation: string;
    location: string;
    notes: string;
  }) => void;
  onDelete?: (id: string) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  candidateToEdit,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(candidateToEdit?.name || '');
  const [age, setAge] = useState<number>(candidateToEdit?.age || 32);
  const [status, setStatus] = useState<Candidate['status']>(candidateToEdit?.status || 'bujang');
  const [occupation, setOccupation] = useState(candidateToEdit?.occupation || '');
  const [location, setLocation] = useState(candidateToEdit?.location || '');
  const [notes, setNotes] = useState(candidateToEdit?.notes || '');

  // Reset when opened
  React.useEffect(() => {
    if (candidateToEdit) {
      setName(candidateToEdit.name);
      setAge(candidateToEdit.age);
      setStatus(candidateToEdit.status);
      setOccupation(candidateToEdit.occupation);
      setLocation(candidateToEdit.location);
      setNotes(candidateToEdit.notes || '');
    } else {
      setName('');
      setAge(30);
      setStatus('bujang');
      setOccupation('');
      setLocation('');
      setNotes('');
    }
  }, [candidateToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Sila masukkan nama calon.');
      return;
    }
    onSave({
      name: name.trim(),
      age: Number(age) || 30,
      status,
      occupation: occupation.trim() || 'Tidak dinyatakan',
      location: location.trim() || 'Malaysia',
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-5 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            {candidateToEdit ? (
              <Edit3 className="w-5 h-5 text-pink-100" />
            ) : (
              <UserPlus className="w-5 h-5 text-pink-100" />
            )}
            <h3 className="font-semibold text-lg">
              {candidateToEdit ? 'Kemaskini Maklumat Calon' : 'Daftar Calon Baharu'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-pink-100 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nama Calon / Kod Nama *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ahmad Farhan / Calon A"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Umur (Tahun)
              </label>
              <input
                type="number"
                min="18"
                max="80"
                value={age}
                onChange={e => setAge(parseInt(e.target.value) || 18)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status Perkahwinan
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Candidate['status'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-sm bg-white"
              >
                <option value="bujang">Bujang</option>
                <option value="duda_beranak">Duda (Ada Anak)</option>
                <option value="duda_tanpa_anak">Duda (Tiada Anak)</option>
                <option value="lain_lain">Lain-lain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pekerjaan & Sektor
            </label>
            <input
              type="text"
              placeholder="Contoh: Jurutera Perisian / Penjawat Awam"
              value={occupation}
              onChange={e => setOccupation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Lokasi / Asal
            </label>
            <input
              type="text"
              placeholder="Contoh: Shah Alam, Selangor"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Latar Belakang / Cara Kenal
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Dikenalkan oleh rakan sekerja, berasal dari Kedah, ada 1 orang anak..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-sm resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {candidateToEdit && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Adakah anda pasti mahu memadamkan data calon "${candidateToEdit.name}"?`)) {
                    onDelete(candidateToEdit.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Padam Calon
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-pink-500/20 transition-colors"
              >
                {candidateToEdit ? 'Simpan Perubahan' : 'Tambah Calon'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
