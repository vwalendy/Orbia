import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { Plus, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import './Sidebar.css';

export function Sidebar() {
  const { categories, hiddenCategoryIds, dispatch } = useCalendar();
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6'); // default blue

  const toggleCategory = (id: string) => {
    dispatch({ type: 'TOGGLE_CATEGORY_VISIBILITY', payload: id });
  };

  const handleAddCategory = () => {
    if (newCatName.trim()) {
      dispatch({ 
        type: 'ADD_CATEGORY', 
        payload: { id: uuidv4(), name: newCatName.trim(), color: newCatColor }
      });
      setNewCatName('');
      setIsAdding(false);
    }
  };

  return (
    <aside className="sidebar-container">
      <div className="create-task-btn-container">
        <button className="create-task-btn" onClick={() => dispatch({ type: 'OPEN_TASK_MODAL' })}>
          <Plus size={20} />
          <span>Create Task</span>
        </button>
      </div>

      <div className="categories-section">
        <h3 className="section-title">My Calendars</h3>
        <ul className="category-list">
          {categories.map((category) => {
            const isHidden = hiddenCategoryIds.has(category.id);
            return (
              <li key={category.id} className="category-item" onClick={() => toggleCategory(category.id)}>
                <div 
                  className={`category-checkbox ${isHidden ? 'hidden' : 'visible'}`}
                  style={{ backgroundColor: isHidden ? 'transparent' : category.color, borderColor: category.color }}
                >
                  {!isHidden && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
                <span className="category-name">{category.name}</span>
              </li>
            );
          })}
        </ul>

        {isAdding ? (
          <div className="add-category-form">
            <input 
              type="color" 
              value={newCatColor} 
              onChange={(e) => setNewCatColor(e.target.value)}
              className="color-picker"
            />
            <input 
              type="text" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Category name..."
              className="category-input"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button className="text-btn save" onClick={handleAddCategory}>Add</button>
            <button className="text-btn cancel" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        ) : (
          <button className="add-category-btn" onClick={() => setIsAdding(true)}>
            <Plus size={16} />
            <span>Add Calendar</span>
          </button>
        )}
      </div>
    </aside>
  );
}
