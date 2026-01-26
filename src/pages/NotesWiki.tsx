import React, { useState, useEffect } from 'react';
import { Plus, FileUp } from 'lucide-react';
import { useStore } from '../components/NotesWiki/store';
import type { Note, TaskStatus } from '../components/NotesWiki/store';
import NotesSearchBar from '../components/NotesWiki/NotesSearchBar';
import NotesFilterMenu from '../components/NotesWiki/NotesFilterMenu';
import NotesActiveFilters from '../components/NotesWiki/NotesActiveFilters';
import NotesList from '../components/NotesWiki/NotesList';
import NoteModal from '../components/NotesWiki/NoteModal';
import DocUploadModal from '../components/NotesWiki/DocUploadModal';
import Toast from '../components/NotesWiki/Toast';
import "../components/NotesWiki/animations.css";


const getAutoColor = (status: TaskStatus): string => {
  const colorMap: Record<TaskStatus, string> = {
    'todo': 'slate',            
    'inprogress': 'yellow',  
    'done': 'green',      
    'urgent': 'red',    
  };
  return colorMap[status] || '';
};

const NOTE_COLORS = [
  { name: 'Default', value: 'slate', bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', darkBg: 'bg-gradient-to-br from-slate-700 to-slate-800', darkBorder: 'border-slate-600' },
  { name: 'Red', value: 'red', bg: 'bg-gradient-to-br from-red-100 to-rose-100', border: 'border-red-300', darkBg: 'bg-gradient-to-br from-red-900 to-rose-900', darkBorder: 'border-red-700' },
  { name: 'Orange', value: 'orange', bg: 'bg-gradient-to-br from-orange-100 to-amber-100', border: 'border-orange-300', darkBg: 'bg-gradient-to-br from-orange-900 to-amber-900', darkBorder: 'border-orange-700' },
  { name: 'Yellow', value: 'yellow', bg: 'bg-gradient-to-br from-yellow-100 to-amber-100', border: 'border-yellow-300', darkBg: 'bg-gradient-to-br from-yellow-900 to-amber-900', darkBorder: 'border-yellow-700' },
  { name: 'Green', value: 'green', bg: 'bg-gradient-to-br from-green-100 to-emerald-100', border: 'border-green-300', darkBg: 'bg-gradient-to-br from-green-900 to-emerald-900', darkBorder: 'border-green-700' },
  { name: 'Blue', value: 'blue', bg: 'bg-gradient-to-br from-blue-100 to-cyan-100', border: 'border-blue-300', darkBg: 'bg-gradient-to-br from-blue-900 to-cyan-900', darkBorder: 'border-blue-700' },
  { name: 'Pink', value: 'pink', bg: 'bg-gradient-to-br from-pink-100 to-rose-100', border: 'border-pink-300', darkBg: 'bg-gradient-to-br from-pink-900 to-rose-900', darkBorder: 'border-pink-700' },
  { name: 'Purple', value: 'purple', bg: 'bg-gradient-to-br from-purple-100 to-violet-100', border: 'border-purple-300', darkBg: 'bg-gradient-to-br from-purple-900 to-violet-900', darkBorder: 'border-purple-700' },
  { name: 'Indigo', value: 'indigo', bg: 'bg-gradient-to-br from-indigo-100 to-blue-100', border: 'border-indigo-300', darkBg: 'bg-gradient-to-br from-indigo-900 to-blue-900', darkBorder: 'border-indigo-700' },
  { name: 'Teal', value: 'teal', bg: 'bg-gradient-to-br from-teal-100 to-cyan-100', border: 'border-teal-300', darkBg: 'bg-gradient-to-br from-teal-900 to-cyan-900', darkBorder: 'border-teal-700' },
];

export default function NotesWiki() {
  const { notes, teamTasks, personalTasks, addNote, updateNote, deleteNote, togglePinNote, initializeData } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTask, setFilterTask] = useState<string>('');
  const [filterTypes, setFilterTypes] = useState<Set<'linked' | 'standalone'>>(new Set());
  const [filterAttachmentTypes, setFilterAttachmentTypes] = useState<Set<'with' | 'without'>>(new Set());
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  const [linkedCurrentPage, setLinkedCurrentPage] = useState(1);
  const [standaloneCurrentPage, setStandaloneCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingDoc, setProcessingDoc] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [showDocUpload, setShowDocUpload] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastVariant, setToastVariant] = useState<'default' | 'delete'>('default');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const filterButton = (e.target as HTMLElement).closest('[data-filter-menu]');
      const filterContainer = (e.target as HTMLElement).closest('[data-filter-container]');
      if (!filterButton && !filterContainer && showFilterMenu) {
        setShowFilterMenu(false);
      }
    };
    
    if (showFilterMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showFilterMenu]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: '',
    linkedTaskId: '',
    linkedTaskType: 'team' as 'team' | 'personal',
    attachments: [] as { name: string; url: string; size: number; path?: string }[],
  });

  const allTasks = [
    ...teamTasks.map((t) => ({ ...t, type: 'team' as const })),
    ...personalTasks.map((t) => ({ ...t, type: 'personal' as const })),
  ];

  const filteredNotes = notes
    .filter((note) => {
      const taskMatch = searchQuery.match(/task:(\S+)/i);
      const taskSearchValue = taskMatch ? taskMatch[1].toLowerCase() : '';
      const textSearch = searchQuery.replace(/task:\S+/i, '').trim().toLowerCase();

      let linkedTaskTitle = '';
      if (taskSearchValue && note.linkedTaskId) {
        const linkedTask = allTasks.find(t => t.id === note.linkedTaskId);
        linkedTaskTitle = linkedTask?.title.toLowerCase() || '';
      }

      const matchesTextSearch = !textSearch || 
        note.title.toLowerCase().includes(textSearch) ||
        note.content.toLowerCase().includes(textSearch);

      const matchesTaskSearch = !taskSearchValue || 
        linkedTaskTitle.includes(taskSearchValue);

      const matchesType =
        filterTypes.size === 0 ||
        (filterTypes.has('linked') && note.linkedTaskId) ||
        (filterTypes.has('standalone') && !note.linkedTaskId);
      
      const matchesTask =
        !filterTask ||
        note.linkedTaskId === filterTask;
      
      const matchesAttachments =
        filterAttachmentTypes.size === 0 ||
        (filterAttachmentTypes.has('with') && note.attachments && note.attachments.length > 0) ||
        (filterAttachmentTypes.has('without') && (!note.attachments || note.attachments.length === 0));
      
      return matchesTextSearch && matchesTaskSearch && matchesType && matchesTask && matchesAttachments;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  const linkedNotes = filteredNotes.filter((note) => note.linkedTaskId);
  const standaloneNotes = filteredNotes.filter((note) => !note.linkedTaskId);
  const totalLinked = linkedNotes.length;
  const totalStandalone = standaloneNotes.length;
  const totalWithAttachments = notes.filter((note) => note.attachments && note.attachments.length > 0).length;

  const linkedTotalPages = Math.ceil(linkedNotes.length / itemsPerPage);
  const linkedPaginatedNotes = linkedNotes.slice(
    (linkedCurrentPage - 1) * itemsPerPage,
    linkedCurrentPage * itemsPerPage
  );

  const standaloneTotalPages = Math.ceil(standaloneNotes.length / itemsPerPage);
  const standalonePaginatedNotes = standaloneNotes.slice(
    (standaloneCurrentPage - 1) * itemsPerPage,
    standaloneCurrentPage * itemsPerPage
  );

  useEffect(() => {
    setLinkedCurrentPage(1);
    setStandaloneCurrentPage(1);
  }, [searchQuery, filterTask, filterTypes, filterAttachmentTypes]);

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);

      let autoColor = note.color || '';
      if (note.linkedTaskId) {
        const linkedTask = allTasks.find((t) => t.id === note.linkedTaskId && t.type === note.linkedTaskType);
        if (linkedTask && 'status' in linkedTask) {
          autoColor = getAutoColor((linkedTask as any).status) ?? note.color ?? '';
        }
      }
      setFormData({
        title: note.title,
        content: note.content,
        color: autoColor,
        linkedTaskId: note.linkedTaskId || '',
        linkedTaskType: note.linkedTaskType || 'team',
        attachments: note.attachments || [],
      });
    } else {
      setEditingNote(null);
      setFormData({
        title: '',
        content: '',
        color: '',
        linkedTaskId: '',
        linkedTaskType: 'team',
        attachments: [],
      });
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingFiles(true);
    setUploadProgress(0);
    
    try {
      const fileArray = Array.from(files);
      const uploadedFiles = await Promise.all(
        fileArray.map((file, index) => {
          return new Promise<{ name: string; url: string; size: number }>((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              resolve({
                name: file.name,
                url: base64,
                size: file.size,
              });
              
              const progress = Math.round(((index + 1) / fileArray.length) * 100);
              setUploadProgress(progress);
            };
            
            reader.onerror = () => {
              reject(new Error(`Failed to read file: ${file.name}`));
            };
            
            reader.readAsDataURL(file);
          });
        })
      );
      
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles],
      }));
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Lỗi khi tải file lên. Vui lòng thử lại.');
    } finally {
      setUploadingFiles(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const noteData = {
      title: formData.title,
      content: formData.content,
      color: formData.color,
      linkedTaskId: formData.linkedTaskId || undefined,
      linkedTaskType: formData.linkedTaskId ? formData.linkedTaskType : undefined,
      attachments: formData.attachments,
    };
    
    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData);
        setToastMessage('Ghi chú đã được cập nhật thành công!');
      } else {
        await addNote(noteData);
        setToastMessage('Ghi chú mới đã được tạo thành công!');
      }
      setToastType('success');
      setToastVariant('default');
      setShowToast(true);
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving note:', error);
      setToastMessage('Lỗi khi lưu ghi chú. Vui lòng thử lại.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const getLinkedTask = (note: Note) => {
    if (!note.linkedTaskId) return null;
    return allTasks.find(
      (t) => t.id === note.linkedTaskId && t.type === note.linkedTaskType
    );
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setToastMessage('Ghi chú đã được xóa thành công!');
    setToastType('success');
    setToastVariant('delete');
    setShowToast(true);
  };

  const getContentPreview = (content: string, wordCount: number = 10): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    const words = plainText.trim().split(/\s+/);
    if (words.length <= wordCount) {
      return plainText.trim();
    }
    return words.slice(0, wordCount).join(' ') + '...';
  };

  const extractDocxText = async (file: File): Promise<string> => {
    try {
      setProcessingProgress(40);
      const arrayBuffer = await file.arrayBuffer();
      
      const view = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      let fullText = decoder.decode(view);
      const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      const matches = fullText.matchAll(textRegex);
      
      const paragraphs: string[] = [];
      let currentParagraph = '';
      
      for (const match of matches) {
        currentParagraph += match[1];
        
        if (fullText.indexOf('</w:p>', fullText.indexOf(match[0])) < 
            fullText.indexOf('<w:t', fullText.indexOf(match[0]) + 1)) {
          if (currentParagraph.trim()) {
            paragraphs.push(currentParagraph.trim());
          }
          currentParagraph = '';
        }
      }
      
      if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
      }
      
      let text = paragraphs.join('\n\n');
      if (!text) {
        const simpleMatches = fullText.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
        text = simpleMatches
          .map(match => match.replace(/<w:t[^>]*>|<\/w:t>/g, ''))
          .filter(t => t.trim().length > 0)
          .join(' ');
      }
      
      setProcessingProgress(70);
      
      if (text && text.trim().length > 0) {
        return text;
      } else {
        return `[Document: ${file.name}]\n\nDocument loaded. Please ensure it contains text content. If text is present but not extracted, try saving as .docx format.`;
      }
    } catch (error) {
      console.error('DOCX extraction error:', error);
      return `[Document File: ${file.name}]\n\nUnable to fully extract text. The document may be encrypted or in an unsupported format. Please copy content manually.`;
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    e.target.value = '';
    setProcessingDoc(true);
    setProcessingProgress(0);
    
    try {
      setProcessingProgress(10);
      
      let fileBase64 = '';
      const fileReader = new FileReader();
      await new Promise<void>((resolve) => {
        fileReader.onload = () => {
          fileBase64 = fileReader.result as string;
          resolve();
        };
        fileReader.readAsDataURL(file);
      });
      
      let extractedText = '';
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (file.type === 'text/plain' || fileExtension === 'txt') {
        setProcessingProgress(30);
        extractedText = await file.text();
        setProcessingProgress(75);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileExtension === 'docx'
      ) {
        extractedText = await extractDocxText(file);
      } else if (
        file.type === 'application/msword' ||
        fileExtension === 'doc'
      ) {
        setProcessingProgress(40);
        extractedText = `[Document: ${file.name}]\n\nOlder DOC format detected. Please convert to DOCX or copy content manually for better extraction.`;
        setProcessingProgress(70);
      } else {
        setProcessingProgress(40);
        extractedText = `[File: ${file.name}]\n\nFile type not fully supported. Please copy content manually.`;
        setProcessingProgress(70);
      }
      
      if (extractedText.length > 5000) {
        extractedText = extractedText.substring(0, 5000) + '\n\n[... Text truncated due to length ...]';
      }
      
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      const title = fileName.charAt(0).toUpperCase() + fileName.slice(1);
      
      setProcessingProgress(85);
      let summaryHtml = '';
      
      if (extractedText.length > 50) {
        try {
          const apiToken = 'hf_kLycNbYQdPzqLrXsZwMnTzJvWxYzAbCdEfGhIjKlMn';
          const response = await fetch(
            'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
            {
              headers: { Authorization: `Bearer ${apiToken}` },
              method: 'POST',
              body: JSON.stringify({
                inputs: extractedText.substring(0, 1024),
                parameters: {
                  max_length: 150,
                  min_length: 50,
                },
              }),
            }
          );

          if (response.ok) {
            const result = await response.json();
            if (result[0]?.summary_text) {
              const summary = result[0].summary_text;
              summaryHtml = `
                <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
                  <p style="margin: 0; color: #1e40af; font-weight: 600; font-size: 0.9em; margin-bottom: 8px;">🤖 AI Summary</p>
                  <p style="margin: 0; color: #334155; line-height: 1.6;">${summary}</p>
                </div>
              `;
            }
          }
        } catch (error) {
          console.error('Error during auto-summarization:', error);
          
          try {
            const sentences = extractedText.match(/[^.!?]+[.!?]+/g) || [];
            const summaryLength = Math.max(2, Math.ceil(sentences.length * 0.3));
            const summary = sentences.slice(0, summaryLength).join(' ').trim();
            
            if (summary) {
              summaryHtml = `
                <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
                  <p style="margin: 0; color: #334155; line-height: 1.6;">${summary}</p>
                </div>
              `;
            }
          } catch {
            // Silent catch
          }
        }
      }

      setFormData({
        title: title,
        content: summaryHtml || extractedText,
        color: '',
        linkedTaskId: '',
        linkedTaskType: 'team',
        attachments: [{ name: file.name, url: fileBase64, size: file.size }],
      });
      
      setProcessingProgress(95);
      setTimeout(() => {
        setShowDocUpload(false);
        setShowModal(true);
      }, 300);
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Lỗi khi xử lý tài liệu. Vui lòng thử lại.');
    } finally {
      setProcessingDoc(false);
      setProcessingProgress(0);
    }
  };

  return (
    <div 
      className="min-h-screen bg-white text-gray-900"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6 sm:py-8 pb-16 sm:pb-20">
    
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Notes & Wiki</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 lg:ml-auto">
            <button
              onClick={() => setShowDocUpload(true)}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-smooth btn-press text-sm sm:text-base"
            >
              <FileUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Tạo từ File</span>
              <span className="sm:hidden">File</span>
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-smooth btn-press text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Tạo ghi chú mới</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-row gap-2 sm:gap-4">
          <NotesSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            darkMode={false}
          />
          
          <div className="flex items-center gap-2 relative flex-shrink-0">
            <NotesFilterMenu
              showFilterMenu={showFilterMenu}
              setShowFilterMenu={setShowFilterMenu}
              filterTypes={filterTypes}
              setFilterTypes={setFilterTypes}
              filterAttachmentTypes={filterAttachmentTypes}
              setFilterAttachmentTypes={setFilterAttachmentTypes}
              totalLinked={totalLinked}
              totalStandalone={totalStandalone}
              totalWithAttachments={totalWithAttachments}
              notes={notes}
              
            />
          </div>
        </div>

        <NotesActiveFilters
          filterTypes={filterTypes}
          setFilterTypes={setFilterTypes}
          filterTask={filterTask}
          setFilterTask={setFilterTask}
          filterAttachmentTypes={filterAttachmentTypes}
          setFilterAttachmentTypes={setFilterAttachmentTypes}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredNotesCount={filteredNotes.length}
          allTasks={allTasks}
        />
      </div>

      <NotesList
        linkedNotes={linkedNotes}
        standaloneNotes={standaloneNotes}
        linkedPaginatedNotes={linkedPaginatedNotes}
        standalonePaginatedNotes={standalonePaginatedNotes}
        linkedCurrentPage={linkedCurrentPage}
        setLinkedCurrentPage={setLinkedCurrentPage}
        linkedTotalPages={linkedTotalPages}
        standaloneCurrentPage={standaloneCurrentPage}
        setStandaloneCurrentPage={setStandaloneCurrentPage}
        standaloneTotalPages={standaloneTotalPages}
        itemsPerPage={itemsPerPage}
        getLinkedTask={getLinkedTask}
        getContentPreview={getContentPreview}
        handleOpenModal={handleOpenModal}
        deleteNote={handleDeleteNote}
        togglePinNote={togglePinNote}
        NOTE_COLORS={NOTE_COLORS}
        
      />

      <NoteModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingNote={editingNote}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleRemoveAttachment={handleRemoveAttachment}
        handleFileUpload={handleFileUpload}
        allTasks={allTasks}
        NOTE_COLORS={NOTE_COLORS}
        uploadingFiles={uploadingFiles}
        uploadProgress={uploadProgress}
        
      />

      <DocUploadModal
        showDocUpload={showDocUpload}
        setShowDocUpload={setShowDocUpload}
        handleDocumentUpload={handleDocumentUpload}
        processingDoc={processingDoc}
        processingProgress={processingProgress}
      />

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          variant={toastVariant}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
      </div>
    </div>
  );
}