"use client";

import { useState, useEffect, useRef } from "react";
import { Modal } from "@shared/ui/Modal";
import Button from "@shared/ui/Button";
import { CustomSelect } from "@shared/ui/Select";
import { useTeacherSubjects } from "@entities/subject/model/useTeacherSubjects"; 
import { useGroups } from "@entities/group/model/useGroups"; 
import { createHomeworkRequest } from "@entities/homework/api/homeworkApi";
import { 
  IoImageOutline, 
  IoClose, 
  IoCalendarOutline, 
  IoDocumentAttachOutline,
  IoAdd 
} from "react-icons/io5"; 
import styles from "./styles.module.scss";

export const CreateHomeworkModal = ({ isOpen, onClose, initialSubjectName, onSuccess }: any) => {
  const { subjects, isLoading: isSubjectsLoading } = useTeacherSubjects();
  const { groups } = useGroups();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "REGULAR",
    subjectId: "",
    groupId: "",
    deadline: ""
  });
  
  // Стейт для іконки
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Стейт для файлів матеріалів
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (iconPreview) URL.revokeObjectURL(iconPreview);
    };
  }, [iconPreview]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (iconPreview) URL.revokeObjectURL(iconPreview);
    setIconFile(selected);
    if (selected) setIconPreview(URL.createObjectURL(selected));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const clearIcon = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIconFile(null);
    setIconPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'deadline') data.append(key, value + "T23:59:59");
      else data.append(key, value);
    });

    if (file) data.append("file", file);
    if (iconFile) data.append("icon", iconFile); 

    try {
      await createHomeworkRequest(token, data); 
      onSuccess();
      onClose();
    } catch (err) {
      alert("Помилка при створенні завдання");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Нове завдання">
      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.headerFields}>
          <div className={styles.iconUpload} onClick={() => iconInputRef.current?.click()}>
            <input type="file" ref={iconInputRef} hidden accept="image/*" onChange={handleIconChange} />
            {iconPreview ? (
              <div className={styles.iconPreviewWrapper}>
                <img src={iconPreview} alt="Icon" className={styles.iconImage} />
                <button type="button" className={styles.removeIcon} onClick={clearIcon}><IoClose /></button>
              </div>
            ) : (
              <div className={styles.iconPlaceholder}>
                <IoImageOutline />
                <span>+ Іконка</span>
              </div>
            )}
          </div>

          <div className={styles.field} style={{flex: 1}}>
            <label className={styles.label}>Заголовок</label>
            <input 
              type="text" 
              placeholder="Назва завдання..."
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Опис</label>
          <textarea 
            rows={3} 
            placeholder="Інструкції для студентів..." 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Дисципліна</label>
            <CustomSelect 
              value={formData.subjectId}
              onChange={val => setFormData({...formData, subjectId: val})}
              options={subjects.map(s => ({ value: s.id.toString(), label: s.name }))}
              placeholder="Оберіть предмет"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Група</label>
            <CustomSelect 
              value={formData.groupId}
              onChange={val => setFormData({...formData, groupId: val})}
              options={groups.map(g => ({ value: g.id.toString(), label: g.name }))}
              placeholder="Оберіть групу"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Файл завдання (PDF, ZIP, DOCX)</label>
          <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
          <div className={styles.fileDropArea} onClick={() => fileInputRef.current?.click()}>
            {file ? (
              <div className={styles.selectedFile}>
                <IoDocumentAttachOutline />
                <span>{file.name}</span>
                <button type="button" className={styles.clearFile} onClick={(e) => {e.stopPropagation(); setFile(null);}}>
                  Змінити
                </button>
              </div>
            ) : (
              <div className={styles.filePlaceholder}>
                <IoAdd /> <span>Додати матеріали</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Термін виконання</label>
          <div className={styles.dateWrapper}>
            <IoCalendarOutline />
            <input type="date" required onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>Скасувати</Button>
          <Button type="submit" variant="primary" className={styles.submit}>Опублікувати</Button>
        </div>
      </form>
    </Modal>
  );
};