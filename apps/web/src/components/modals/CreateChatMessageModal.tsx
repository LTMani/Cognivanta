import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface CreateChatMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, unknown>) => void;
}

export const CreateChatMessageModal: React.FC<CreateChatMessageModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (onSubmit) onSubmit({ name, description });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure ChatMessage">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">ChatMessage Name</label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description & Purpose</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2 bg-surface-300 border border-card-border rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="Provide operational description..."
          />
        </div>

        <div className="pt-4 border-t border-card-border flex justify-end space-x-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create ChatMessage'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
