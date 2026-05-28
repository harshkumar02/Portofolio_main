import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { getDocs, addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-comment';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, RefreshCw } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import ErrorBoundary from './ErrorBoundary';

const Comment = memo(({ comment, formatDate, index }) => (
    <div 
        className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5"
        
    >
        <div className="flex items-start gap-3 ">
            {comment.profileImage ? (
                <img
                    src={comment.profileImage}
                    alt={`${comment.userName}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
                    loading="lazy"
                />
            ) : (
                <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="font-medium text-white truncate">{comment.userName}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">{comment.content}</p>
            </div>
        </div>
    </div>
));

const validateComment = (content, userName) => {
  const contentRegex = /^[a-zA-Z0-9 .,!?\-\(\)\[\]{}@#$%^&*+=<>:;"'\/|\\`~]+$/;
  const userNameRegex = /^[a-zA-Z0-9 _\-\(\)]+$/;

  if (!content || content.trim().length < 1 || content.trim().length > 1000) {
    return { valid: false, error: 'Comment must be between 1 and 1000 characters' };
  }

  if (!contentRegex.test(content)) {
    return { valid: false, error: 'Comment contains invalid characters' };
  }

  if (!userName || userName.trim().length < 1 || userName.trim().length > 50) {
    return { valid: false, error: 'Name must be between 1 and 50 characters' };
  }

  if (!userNameRegex.test(userName)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }

  return { valid: true };
};

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [validationError, setValidationError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setValidationError('Image must be less than 5MB');
                return;
            }
            setValidationError('');
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        setValidationError('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleUserNameChange = useCallback((e) => {
        setUserName(e.target.value);
        setValidationError('');
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const validation = validateComment(newComment, userName);
        if (!validation.valid) {
            setValidationError(validation.error);
            return;
        }

        if (!newComment.trim() || !userName.trim()) return;

        onSubmit({ newComment: newComment.trim(), userName: userName.trim(), imageFile });
        setNewComment('');
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
        setValidationError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={handleUserNameChange}
                    placeholder="Enter your name"
                    maxLength={50}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    Message <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    maxLength={1000}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]"
                    required
                />
                <p className="text-xs text-gray-500 text-right">{newComment.length}/1000</p>
            </div>

            {/* Validation Error */}
            {validationError && (
                <div className="p-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg text-sm">
                    {validationError}
                </div>
            )}

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white">
                    Profile Photo <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full" >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-dashed border-indigo-500/50 hover:border-indigo-500 group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-2">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-[#0A66C2] to-[#ffffff] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitCount, setSubmitCount] = useState(0);
    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const unsubscribeRef = useRef(null);

    // Rate limiting - max 3 comments per minute
    const RATE_LIMIT = 3;
    const RATE_WINDOW = 60000; // 1 minute in ms

    useEffect(() => {
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    // Check rate limit before submitting
    const checkRateLimit = useCallback(() => {
        const now = Date.now();
        if (now - lastSubmitTime < RATE_WINDOW) {
            if (submitCount >= RATE_LIMIT) {
                return false;
            }
            setSubmitCount(prev => prev + 1);
        } else {
            setSubmitCount(1);
            setLastSubmitTime(now);
        }
        return true;
    }, [lastSubmitTime, submitCount]);

    useEffect(() => {
        const subscribeToComments = () => {
            const commentsRef = collection(db, 'portfolio-comments');
            const q = query(commentsRef, orderBy('createdAt', 'desc'));

            unsubscribeRef.current = onSnapshot(q, (querySnapshot) => {
                const commentsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setComments(commentsData);
                setLoading(false);
                setError('');
            }, (err) => {
                console.error('Firestore subscription error:', err);
                setError('Failed to load comments. Showing cached data.');
                // Try to load from localStorage as fallback
                try {
                    const cached = JSON.parse(localStorage.getItem('comments') || '[]');
                    setComments(cached);
                } catch (cacheErr) {
                    console.error('No cached comments available');
                }
                setLoading(false);
            });
        };

        subscribeToComments();

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, []);

    const handleRetry = useCallback(() => {
        setError('');
        setLoading(true);
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }
        // Re-subscribe
        const commentsRef = collection(db, 'portfolio-comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));
        unsubscribeRef.current = onSnapshot(q, (querySnapshot) => {
            const commentsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(commentsData);
            setLoading(false);
            setError('');
        }, (err) => {
            setError('Failed to connect. Please check your internet connection.');
            setLoading(false);
        });
    }, []);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        try {
            const storageRef = ref(storage, `profile-images/${Date.now()}_${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            return getDownloadURL(storageRef);
        } catch (err) {
            console.error('Image upload failed:', err);
            throw new Error('Image upload failed');
        }
    }, []);

    // Sanitize text to prevent XSS
    const sanitizeText = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        // Check rate limit
        if (!checkRateLimit()) {
            setError('Too many comments. Please wait a minute before posting again.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const profileImageUrl = await uploadImage(imageFile);

            // Sanitize content before sending
            const sanitizedContent = sanitizeText(newComment);
            const sanitizedUserName = sanitizeText(userName);

            await addDoc(collection(db, 'portfolio-comments'), {
                content: sanitizedContent,
                userName: sanitizedUserName,
                profileImage: profileImageUrl,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            if (err.code === 'permission-denied') {
                setError('Comment could not be posted. Please check the content format.');
            } else {
                setError('Failed to post comment. Please try again.');
            }
            console.error('Error adding comment: ', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage, checkRateLimit]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    return (
        <ErrorBoundary title="Comments Unavailable" message="Unable to load comments section." onRetry={handleRetry}>
        <div className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">
        <div className="p-6 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20">
                    <MessageCircle className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                    Comments <span className="text-indigo-400">({comments.length})</span>
                </h3>
            </div>
        </div>
        <div className="p-6 space-y-6">
            {/* Error State */}
            {error && (
                <div className="flex items-center justify-between gap-2 p-4 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl" data-aos="fade-in">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            )}

            <div >
                <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <p className="text-gray-400 text-sm">Loading comments...</p>
                </div>
            )}

            <div className="space-y-4 h-[300px] overflow-y-auto custom-scrollbar" data-aos="fade-up" data-aos-delay="200">
                {!loading && comments.length === 0 && !error && (
                    <div className="text-center py-8" data-aos="fade-in">
                        <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
                        <p className="text-gray-400">No comments yet. Start the conversation!</p>
                    </div>
                )}
                {!loading && comments.map((comment, index) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        formatDate={formatDate}
                        index={index}
                    />
                ))}
            </div>
        </div>
        <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.5);
                border-radius: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.7);
            }
        `}</style>
        </div>
        </ErrorBoundary>
    );
};

export default Komentar;