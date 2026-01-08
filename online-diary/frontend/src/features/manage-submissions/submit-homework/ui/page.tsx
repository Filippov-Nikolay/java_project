"use client";

import { useState } from "react";
import { formatDate, getTimeRemaining } from "@entities/homework/lib/TimeRemaining";
import { deleteSubmissionRequest } from "@entities/homework/api/homeworkApi";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";
import clsx from "clsx";

import { 
  IoClose, 
  IoTimeOutline, 
  IoCloudUploadOutline, 
  IoDocumentTextOutline, 
  IoTrashOutline, 
  IoCheckmarkCircleOutline, 
  IoRefreshOutline,
  IoFileTrayFullOutline
} from "react-icons/io5";

interface Props {
  task: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const HomeworkDetailModal = ({ task, onClose, onSuccess }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [comment, setComment] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  const { text: timeRemaining, isUrgent } = getTimeRemaining(task.deadline);
  
  const isPending = task.status === 'pending' && !isRetaking;
  const isDone = task.status === 'done' && !isRetaking;
  const showUploadForm = task.status === 'todo' || isRetaking;

  const handleFiles = (newFiles: FileList | null) => {
    if (newFiles) setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancelSubmission = async () => {
    if (!window.confirm("Ви впевнені, що хочете видалити свою роботу?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteSubmissionRequest(token, task.id);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Помилка при скасуванні");
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0 && !comment.trim()) return alert("Додайте файли або коментар");
    setIsSubmitting(true);
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    formData.append("comment", comment);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/assessments/${task.id}/submit`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) { onSuccess(); onClose(); }
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>


        <header className={styles.header}>
          <div className={styles.topMeta}>
            <span className={styles.subjectBadge}>{task.subjectName}</span>
            <span className={styles.assignedDate}>задано {formatDate(task.createdAt)}</span>
          </div>
          <h2 className={styles.title}>{task.title}</h2>
          
          <div className={styles.teacherRow}>
            <div className={styles.avatar}>{task.teacherName?.charAt(0)}</div>
            <div className={styles.teacherInfo}>
              <span className={styles.label}>Викладач</span>
              <span className={styles.name}>{task.teacherName}</span>
            </div>
          </div>
        </header>

        <div className={styles.scrollContent}>
          <section className={styles.descriptionSection}>
            <p className={styles.descText}>{task.description || "Опис завдання відсутній..."}</p>
            {task.fileName && (
              <a href={`/api/files/download/${task.fileName}`} className={styles.teacherFileLink}>
                <IoDocumentTextOutline className={styles.icon} /> 
                <div className={styles.fileLabel}>
                   <span>Матеріали до завдання</span>
                </div>
              </a>
            )}
          </section>

          <div className={clsx(styles.deadlineBanner, isUrgent && styles.urgent)}>
            <div className={styles.deadlineInfo}>
              <IoTimeOutline className={styles.clockIcon} />
              <div className={styles.dText}>
                <span className={styles.dLabel}>Крайній термін</span>
                <span className={styles.dValue}>{formatDate(task.deadline)}</span>
              </div>
            </div>
            <div className={styles.remainingTag}>{timeRemaining}</div>
          </div>

          <div className={styles.actionArea}>
            {showUploadForm ? (
              <div className={styles.uploadBlock}>
                <h3 className={styles.areaTitle}>
                  {isRetaking ? "Повторна відправка" : "Ваша відповідь"}
                </h3>
                <div 
                  className={clsx(styles.dropZone, isDragging && styles.dragActive)}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                >
                  <input type="file" multiple id="fileInput" className={styles.hiddenInput} onChange={(e) => handleFiles(e.target.files)} />
                  <label htmlFor="fileInput" className={styles.dropLabel}>
                    <IoCloudUploadOutline className={styles.uploadIcon} />
                    <p>Перетягніть файли або <span className={styles.blue}>виберіть на пристрої</span></p>
                    <small>ZIP, PDF, DOCX (макс. 25 МБ)</small>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className={styles.fileList}>
                    {files.map((f, i) => (
                      <div key={i} className={styles.fileChip}>
                        <IoDocumentTextOutline />
                        <span className={styles.fileName}>{f.name}</span>
                        <button className={styles.removeFile} onClick={() => removeFile(i)}>
                          <IoClose />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <textarea 
                  className={styles.commentField} 
                  placeholder="Додайте коментар до роботи (необов'язково)..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            ) : isPending ? (
              <div className={styles.statusCard}>
                 <div className={styles.statusIconWrapper}>
                    <IoTimeOutline className={styles.statusIcon} />
                 </div>
                 <h3>На перевірці</h3>
                 <p className={styles.statusDesc}>Ви вже надіслали роботу. Ви можете скасувати здачу, щоб внести зміни.</p>
                 
                 {task.submissionFileName && (
                   <a href={`/api/files/download/${task.submissionFileName}`} className={styles.myFileLink}>
                      <IoFileTrayFullOutline /> Переглянути надіслану роботу
                   </a>
                 )}

                 <Button variant="secondary" onClick={handleCancelSubmission} className={styles.cancelBtn}>
                    <IoTrashOutline /> Скасувати здачу
                 </Button>
              </div>
            ) : isDone ? (
              <div className={clsx(styles.statusCard, styles.doneCard)}>
                 <div className={styles.scoreContainer}>
                    <span className={styles.scoreValue}>{task.grade}</span>
                    <span className={styles.scoreMax}>/{task.pointsMax}</span>
                 </div>
                 <h3>Завдання оцінено</h3>
                 
                 {task.feedback && (
                   <div className={styles.feedbackBox}>
                      <span className={styles.fbLabel}>Відгук вчителя:</span>
                      <p>{task.feedback}</p>
                   </div>
                 )}

                 <div className={styles.doneFooter}>
                    <Button variant="primary" onClick={() => setIsRetaking(true)} className={styles.retakeBtn}>
                        <IoRefreshOutline /> Подати на перездачу
                    </Button>
                    {task.submissionFileName && (
                       <a href={`/api/files/download/${task.submissionFileName}`} className={styles.downloadOld}>
                          Завантажити надісланий файл
                       </a>
                    )}
                 </div>
              </div>
            ) : null}
          </div>
        </div>

        <footer className={styles.footer}>
          {showUploadForm && (
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className={styles.mainSubmitBtn}
            >
              {isSubmitting ? "Надсилаємо..." : "Надіслати на перевірку"}
            </Button>
          )}
          <button className={styles.closeTextBtn} onClick={onClose}>Повернутися до списку</button>
        </footer>
      </div>
    </div>
  );
};