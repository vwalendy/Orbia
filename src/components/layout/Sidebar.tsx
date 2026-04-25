import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { Plus, Check, Edit2, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import './Sidebar.css';
import type { Category } from '../../types';

export function Sidebar() {
  const { categories, hiddenCategoryIds, dispatch } = useCalendar();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const toggleCategory = (id: string) => {
    dispatch({ type: 'TOGGLE_CATEGORY_VISIBILITY', payload: id });
  };

  const startAdd = () => {
    setEditName('');
    setEditColor('#5e6ad2'); // deep blue default
    setIsAdding(true);
    setEditingCatId(null);
  };

  const startEdit = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(cat.name);
    setEditColor(cat.color);
    setEditingCatId(cat.id);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!editName.trim()) return;

    if (isAdding) {
      dispatch({ 
        type: 'ADD_CATEGORY', 
        payload: { id: uuidv4(), name: editName.trim(), color: editColor }
      });
      setIsAdding(false);
    } else if (editingCatId) {
      dispatch({
        type: 'UPDATE_CATEGORY',
        payload: { id: editingCatId, name: editName.trim(), color: editColor }
      });
      setEditingCatId(null);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingCatId(null);
  };

  return (
    <aside className="sidebar-container">
      <div className="create-task-btn-container">
        <button className="create-task-btn" onClick={() => dispatch({ type: 'OPEN_TASK_MODAL' })}>
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="categories-section">
        <div className="categories-header">
          <h3 className="section-title">Calendars</h3>
          {!isAdding && !editingCatId && (
            <button className="icon-btn-small" onClick={startAdd}><Plus size={16} /></button>
          )}
        </div>

        <ul className="category-list">
          {categories.map((category) => {
            const isHidden = hiddenCategoryIds.has(category.id);
            const isEditingThis = editingCatId === category.id;

            if (isEditingThis) {
              return (
                <div key={category.id} className="edit-category-form">
                  <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="color-picker" />
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="category-input" autoFocus onKeyDown={e => e.key === 'Enter' && handleSave()} />
                  <div className="edit-actions">
                    <button className="action-save" onClick={handleSave}><Check size={16} /></button>
                    <button className="action-cancel" onClick={cancelEdit}><X size={16} /></button>
                  </div>
                </div>
              );
            }

            return (
              <li key={category.id} className="category-item" onClick={() => toggleCategory(category.id)}>
                <div className="category-pill-wrap">
                  <div className="category-checkbox" style={{ backgroundColor: isHidden ? 'transparent' : category.color, borderColor: category.color }}>
                    {!isHidden && <Check size={12} color="#fff" strokeWidth={3} />}
                  </div>
                  <span className="category-name">{category.name}</span>
                </div>
                <div className="category-actions">
                  <button className="cat-action-btn edit" onClick={(e) => startEdit(category, e)}><Edit2 size={14} /></button>
                  <button className="cat-action-btn delete" onClick={(e) => handleDelete(category.id, e)}><Trash2 size={14} /></button>
                </div>
              </li>
            );
          })}
        </ul>

        {isAdding && (
          <div className="edit-category-form">
            <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="color-picker" />
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name..." className="category-input" autoFocus onKeyDown={e => e.key === 'Enter' && handleSave()} />
            <div className="edit-actions">
              <button className="action-save" onClick={handleSave}><Check size={16} /></button>
              <button className="action-cancel" onClick={cancelEdit}><X size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
