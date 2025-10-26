import { useState, useRef } from 'react';
import { Send, Upload, Loader, FileText, X, Code } from 'lucide-react';
import { chatAPI } from '../../services/api';

export default function MessageInput({ conversationId, onMessageSent }) {
  const [message, setMessage] = useState('');
  const [useRAG, setUseRAG] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [document, setDocument] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCodeExec, setShowCodeExec] = useState(false);
  const [code, setCode] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const fileInputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage('');
    setLoading(true);

    try {
      await chatAPI.sendMessage({
        conversationId,
        message: userMessage,
        useRAG
      });
      onMessageSent();
    } catch (error) {
      console.error('Send message error:', error);
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!document.trim()) return alert('Please enter document content');

    try {
      setUploading(true);
      const { data } = await chatAPI.uploadDocument({
        document,
        title: 'Text Document'
      });
      setDocument('');
      setShowUpload(false);
      alert(data.message || 'Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) return alert('Only PDF, DOCX, and TXT files are allowed');
      if (file.size > 10 * 1024 * 1024) return alert('File size must be less than 10MB');
      setUploadedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      setUploading(true);
      const { data } = await chatAPI.uploadFile(formData);
      setUploadedFile(null);
      setShowUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert(data.message || 'File uploaded successfully!');
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

 const handleCodeExecution = async () => {
  if (!code.trim()) {
    alert('Please enter code to execute');
    return;
  }

  try {
    setLoading(true);
    const { data } = await chatAPI.executeCode({
      code,
      language: codeLanguage
    });

    console.log('Code execution result:', data);

    // Create a formatted message
    let resultMessage = `**Code Execution (${data.language}):**\n\n`;
    resultMessage += `\`\`\`${data.language}\n${code}\n\`\`\`\n\n`;
    resultMessage += `**Result:**\n`;
    if (data.success) {
      resultMessage += `✅ Success\n\n\`\`\`\n${data.output}\n\`\`\``;
    } else {
      resultMessage += `❌ Error\n\n\`\`\`\n${data.error}\n\`\`\``;
    }
    
    setMessage(resultMessage);
    setCode('');
    setShowCodeExec(false);
    
    // Show success/error alert
    if (data.success) {
      alert('Code executed successfully!');
    } else {
      alert('Code execution failed: ' + data.error);
    }
    
  } catch (error) {
    console.error('Code execution error:', error);
    alert('Failed to execute code: ' + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="border-t border-gray-800 bg-gray-900 p-4">
      {showUpload && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700 text-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Upload Document</h3>
            <button
              onClick={() => {
                setShowUpload(false);
                setDocument('');
                setUploadedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* File Upload */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Upload PDF/DOCX/TXT File</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt"
              disabled={uploading}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 disabled:opacity-50"
            />
            {uploadedFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-200">
                <FileText size={16} />
                <span>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
            {uploadedFile && (
              <button
                onClick={handleFileUpload}
                disabled={uploading}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:bg-indigo-700 flex items-center gap-2"
              >
                {uploading ? <Loader size={16} className="animate-spin" /> : 'Upload File'}
              </button>
            )}
          </div>

          <div className="text-center text-gray-400 text-sm my-2">OR</div>

          {/* Text Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Paste Text Content</label>
            <textarea
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              placeholder="Paste your document content here..."
              disabled={uploading}
              className="w-full h-32 p-2 border border-gray-700 rounded-lg resize-none bg-gray-800 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={handleUploadDocument}
              disabled={!document.trim() || uploading}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:bg-green-700 flex items-center gap-2"
            >
              {uploading ? <Loader size={16} className="animate-spin" /> : 'Upload Text'}
            </button>
          </div>
        </div>
      )}

      {showCodeExec && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700 text-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Execute Code</h3>
            <button onClick={() => { setShowCodeExec(false); setCode(''); }} className="text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-200"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={codeLanguage === 'python' ? 'print("Hello, World!")' : 'console.log("Hello, World!")'}
              className="w-full h-32 p-2 border border-gray-700 rounded-lg font-mono text-sm resize-none bg-gray-900 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleCodeExecution}
            disabled={!code.trim() || loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:bg-purple-700"
          >
            {loading ? 'Executing...' : 'Run Code'}
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => { setShowUpload(!showUpload); setShowCodeExec(false); }}
          disabled={uploading}
          className={`px-3 py-2 ${showUpload ? 'text-indigo-500' : 'text-gray-400'} hover:text-indigo-400 transition-colors disabled:opacity-50`}
          title="Upload Document"
        >
          <Upload size={20} />
        </button>

        <button
          type="button"
          onClick={() => { setShowCodeExec(!showCodeExec); setShowUpload(false); }}
          disabled={uploading}
          className={`px-3 py-2 ${showCodeExec ? 'text-purple-500' : 'text-gray-400'} hover:text-purple-400 transition-colors disabled:opacity-50`}
          title="Execute Code"
        >
          <Code size={20} />
        </button>

        <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 whitespace-nowrap">
          <input
            type="checkbox"
            checked={useRAG}
            onChange={(e) => setUseRAG(e.target.checked)}
            className="rounded bg-gray-700 border-gray-600 checked:bg-indigo-500"
          />
          Use RAG
        </label>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={loading || uploading}
        />

        <button
          type="submit"
          disabled={loading || !message.trim() || uploading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-indigo-700 flex items-center gap-2"
        >
          {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
