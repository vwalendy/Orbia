import React, { useState, useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import type { Task } from '../../types';
import './TaskModal.css';

export function TaskModal() {
  const { isTaskModalOpen, editingTaskId, tasks, categories, dispatch } = useCalendar();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(''); // YYYY-MM-DDTHH:mm
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (isTaskModalOpen) {
      if (editingTaskId) {
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || '');
          setStartDate(format(new Date(task.startDate), "yyyy-MM-dd'T'HH:mm"));
          setEndDate(format(new Date(task.endDate), "yyyy-MM-dd'T'HH:mm"));
          setCategoryId(task.categoryId || '');
        }
      } else {
        setTitle('');
        setDescription('');
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        setStartDate(format(now, "yyyy-MM-dd'T'HH:mm"));
        setEndDate(format(oneHourLater, "yyyy-MM-dd'T'HH:mm"));
        setCategoryId(categories.length > 0 ? categories[0].id : '');
      }
    }
  }, [isTaskModalOpen, editingTaskId, tasks, categories]);

  if (!isTaskModalOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !startDate || !endDate) return;

    const taskData: Task = {
      id: editingTaskId || uuidv4(),
      title: title.trim(),
      description: description.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      categoryId: categoryId || undefined,
    };

    if (editingTaskId) {
      dispatch({ type: 'UPDATE_TASK', payload: taskData });
    } else {
      dispatch({ type: 'ADD_TASK', payload: taskData });
    }
    
    dispatch({ type: 'CLOSE_TASK_MODAL' });
  };

  const handleDelete = () => {
    if (editingTaskId) {
      dispatch({ type: 'DELETE_TASK', payload: editingTaskId });
      dispatch({ type: 'CLOSE_TASK_MODAL' });
    }
  };

  return (
    <div className="modal-overlay" onClick={() => dispatch({ type: 'CLOSE_TASK_MODAL' })}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingTaskId ? 'Edit Task' : 'New Task'}</h2>
          <button className="icon-btn" onClick={() => dispatch({ type: 'CLOSE_TASK_MODAL' })}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <input 
            type="text" 
            placeholder="Add title" 
            className="modal-input title-input" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <div className="form-group row">
            <div className="input-half">
              <label>Start</label>
              <input 
                type="datetime-local" 
                className="modal-input" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="input-half">
              <label>End</label>
              <input 
                type="datetime-local" 
                className="modal-input" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Calendar</label>
            <select 
              className="modal-input" 
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="modal-input textarea" 
              placeholder="Add description..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          {editingTaskId && (
            <button className="btn btn-delete" onClick={handleDelete}>Delete</button>
          )}
          <button className="btn btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
