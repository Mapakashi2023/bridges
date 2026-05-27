import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiArrowLeft, FiZap, FiRefreshCw } from 'react-icons/fi';
import { geminiService } from '../services/geminiService';
import { apiService } from '../services/apiService';
import toast, { Toaster } from 'react-hot-toast';

interface CourseData {
  keywords: string[];
  title: string;
  objectives: string[];
  targetAudience: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  outline: any;
  interactiveComponents: string[];
  aiAvatar: string;
  category: string;
}

const STEPS = [
  { id: 1, name: 'Keywords & Title', icon: '🎯' },
  { id: 2, name: 'Objectives & Audience', icon: '📋' },
  { id: 3, name: 'Course Outline', icon: '📚' },
  { id: 4, name: 'Interactive Components', icon: '🎮' },
  { id: 5, name: 'AI Avatar & Settings', icon: '🤖' },
  { id: 6, name: 'Review & Generate', icon: '✨' },
];

const INTERACTIVE_TYPES = [
  { value: 'lectures', label: 'Lectures', icon: '📖', description: 'Text-based lessons' },
  { value: 'videos', label: 'Videos', icon: '🎥', description: 'Video content' },
  { value: 'flashcards', label: 'Flashcards', icon: '🎴', description: 'Quick review cards' },
  { value: 'scenarios', label: 'Scenarios', icon: '🎭', description: 'Real-world situations' },
  { value: 'roleplaying', label: 'Role Playing', icon: '🎪', description: 'Interactive scenarios' },
  { value: 'fillblanks', label: 'Fill in Blanks', icon: '📝', description: 'Complete sentences' },
  { value: 'casestudies', label: 'Case Studies', icon: '📊', description: 'Detailed analysis' },
  { value: 'draganddrop', label: 'Drag & Drop', icon: '🖱️', description: 'Interactive sorting' },
  { value: 'matching', label: 'Matching', icon: '🔗', description: 'Match pairs' },
  { value: 'quizzes', label: 'Quizzes', icon: '❓', description: 'Assessment tests' },
];

const AI_AVATARS = [
  { id: 'professor', name: 'Professor Alex', image: '👨‍🏫', voice: 'professional' },
  { id: 'mentor', name: 'Mentor Sarah', image: '👩‍💼', voice: 'friendly' },
  { id: 'coach', name: 'Coach Mike', image: '👨‍💻', voice: 'enthusiastic' },
  { id: 'guide', name: 'Guide Emma', image: '👩‍🎓', voice: 'calm' },
];

export default function AICourseCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState<Partial<CourseData>>({
    keywords: [],
    objectives: [],
    interactiveComponents: [],
    complexity: 'beginner',
  });

  const [titleSuggestions, setTitleSuggestions] = useState<any[]>([]);
  const [objectiveSuggestions, setObjectiveSuggestions] = useState<any[]>([]);
  const [outlineSuggestion, setOutlineSuggestion] = useState<any>(null);

  // Step 1: Keywords & Title
  const [keywordInput, setKeywordInput] = useState('');

  function handleAddKeyword() {
    if (keywordInput.trim()) {
      setCourseData(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  }

  async function handleGenerateTitles() {
    if (!courseData.keywords || courseData.keywords.length === 0) {
      toast.error('Please add at least one keyword');
      return;
    }

    setLoading(true);
    toast.loading('AI is generating course titles...', { id: 'titles' });

    try {
      const suggestions = await geminiService.generateCourseTitles(
        courseData.keywords,
        courseData.targetAudience || 'general learners'
      );
      setTitleSuggestions(suggestions);
      toast.success('Titles generated!', { id: 'titles' });
    } catch (error) {
      toast.error('Failed to generate titles', { id: 'titles' });
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Objectives
  async function handleGenerateObjectives() {
    if (!courseData.title) {
      toast.error('Please select a title first');
      return;
    }

    setLoading(true);
    toast.loading('AI is crafting learning objectives...', { id: 'objectives' });

    try {
      const suggestions = await geminiService.generateLearningObjectives(
        courseData.title,
        courseData.keywords || [],
        courseData.complexity || 'beginner',
        courseData.targetAudience || 'general learners'
      );
      setObjectiveSuggestions(suggestions);
      toast.success('Objectives ready!', { id: 'objectives' });
    } catch (error) {
      toast.error('Failed to generate objectives', { id: 'objectives' });
    } finally {
      setLoading(false);
    }
  }

  // Step 3: Course Outline
  async function handleGenerateOutline() {
    if (!courseData.objectives || courseData.objectives.length === 0) {
      toast.error('Please add learning objectives');
      return;
    }

    setLoading(true);
    toast.loading('AI is designing course structure...', { id: 'outline' });

    try {
      const outline = await geminiService.generateCourseOutline(
        courseData.title || '',
        courseData.objectives,
        courseData.complexity || 'beginner',
        courseData.estimatedDuration || '4 weeks'
      );
      setOutlineSuggestion(outline);
      setCourseData(prev => ({ ...prev, outline }));
      toast.success('Course outline created!', { id: 'outline' });
    } catch (error) {
      toast.error('Failed to generate outline', { id: 'outline' });
    } finally {
      setLoading(false);
    }
  }

  // Navigation
  function handleNext() {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  // Final Course Generation
  async function handleGenerateCourse() {
    setLoading(true);
    toast.loading('AI is building your complete course...', { id: 'generate' });

    try {
      // Create course in database
      const coursePayload = {
        title: courseData.title,
        description: `A comprehensive ${courseData.complexity} level course on ${courseData.title}`,
        course_code: `COURSE${Date.now()}`,
        category: courseData.category || 'General',
        level: courseData.complexity,
        duration_weeks: parseInt(courseData.estimatedDuration || '4'),
        credits: Math.ceil(parseInt(courseData.estimatedDuration || '4') / 2),
        status: 'draft',
      };

      const result = await apiService.createCourse(coursePayload);

      if (result.success) {
        const courseId = result.data.id;

        // Create modules and lessons
        if (courseData.outline && courseData.outline.modules) {
          for (let index = 0; index < courseData.outline.modules.length; index++) {
            const module = courseData.outline.modules[index];
            const moduleResult = await apiService.createModule(courseId, {
              title: module.title,
              description: module.description,
              order_index: index + 1,
            });

            if (moduleResult.success) {
              const moduleId = moduleResult.data.id;

              // Create lessons for each module
              for (let lessonIndex = 0; lessonIndex < module.topics.length; lessonIndex++) {
                const topic = module.topics[lessonIndex];
                await apiService.createLesson(moduleId, {
                  title: topic,
                  content: `Detailed content for ${topic}`,
                  content_type: 'text',
                  order_index: lessonIndex + 1,
                  is_preview: lessonIndex === 0,
                });
              }
            }
          }
        }

        toast.success('🎉 Course generated successfully!', { id: 'generate' });
        setTimeout(() => {
          window.location.href = `/teacher/courses/${courseId}/edit`;
        }, 2000);
      } else {
        toast.error('Failed to create course', { id: 'generate' });
      }
    } catch (error) {
      console.error('Error generating course:', error);
      toast.error('Failed to generate course', { id: 'generate' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <FiZap className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Course Creator</h1>
              <p className="text-blue-300">Let AI help you build an amazing course</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <motion.div
                  className={`flex items-center gap-3 ${
                    currentStep >= step.id ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      currentStep === step.id
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110'
                        : currentStep > step.id
                        ? 'bg-green-500/30'
                        : 'bg-white/10'
                    }`}
                  >
                    {currentStep > step.id ? <FiCheck /> : step.icon}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-white font-semibold text-sm">{step.name}</p>
                  </div>
                </motion.div>
                {index < STEPS.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 rounded-full ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
          >
            {/* Step 1: Keywords & Title */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">📚 What's your course about?</h2>

                {/* Keywords Input */}
                <div className="mb-8">
                  <label className="block text-white mb-3">Enter keywords (topics your course will cover)</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                      placeholder="e.g., Python, Machine Learning, Data Science"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddKeyword}
                      className="px-6 py-3 bg-blue-500/20 text-blue-300 rounded-xl font-semibold hover:bg-blue-500/30"
                    >
                      Add
                    </motion.button>
                  </div>

                  {/* Keywords Display */}
                  {courseData.keywords && courseData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {courseData.keywords.map((keyword, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold flex items-center gap-2"
                        >
                          {keyword}
                          <button
                            onClick={() => {
                              setCourseData(prev => ({
                                ...prev,
                                keywords: prev.keywords?.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-purple-300 hover:text-white"
                          >
                            ×
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate Titles Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateTitles}
                  disabled={loading || !courseData.keywords?.length}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 mb-8"
                >
                  <FiZap /> {loading ? 'AI is thinking...' : 'Generate Course Titles with AI'}
                </motion.button>

                {/* Title Suggestions */}
                {titleSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">✨ AI-Generated Title Suggestions</h3>
                    <div className="space-y-3">
                      {titleSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setCourseData(prev => ({ ...prev, title: suggestion.title }));
                            toast.success('Title selected!');
                          }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            courseData.title === suggestion.title
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-white/10 bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-bold text-lg mb-1">{suggestion.title}</h4>
                              <p className="text-white/60 text-sm">{suggestion.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                                {suggestion.relevance}% match
                              </span>
                              {courseData.title === suggestion.title && (
                                <FiCheck className="text-blue-400 text-xl" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Objectives & Audience */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">🎯 Define Learning Objectives</h2>

                {/* Target Audience */}
                <div className="mb-6">
                  <label className="block text-white mb-3">Target Audience</label>
                  <input
                    type="text"
                    value={courseData.targetAudience || ''}
                    onChange={(e) => setCourseData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="e.g., Beginners in programming, Business professionals, Students"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40"
                  />
                </div>

                {/* Complexity Level */}
                <div className="mb-8">
                  <label className="block text-white mb-3">Complexity Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <motion.button
                        key={level}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCourseData(prev => ({ ...prev, complexity: level }))}
                        className={`p-4 rounded-xl border-2 font-semibold capitalize ${
                          courseData.complexity === level
                            ? 'border-blue-500 bg-blue-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/60'
                        }`}
                      >
                        {level}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Generate Objectives */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateObjectives}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 mb-8"
                >
                  <FiZap /> {loading ? 'AI is crafting objectives...' : 'Generate Learning Objectives with AI'}
                </motion.button>

                {/* Objective Suggestions */}
                {objectiveSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">✨ AI-Generated Learning Objectives</h3>
                    <div className="space-y-3">
                      {objectiveSuggestions.map((obj, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="flex items-start gap-4">
                            <input
                              type="checkbox"
                              checked={courseData.objectives?.includes(obj.objective) || false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCourseData(prev => ({
                                    ...prev,
                                    objectives: [...(prev.objectives || []), obj.objective]
                                  }));
                                } else {
                                  setCourseData(prev => ({
                                    ...prev,
                                    objectives: prev.objectives?.filter(o => o !== obj.objective)
                                  }));
                                }
                              }}
                              className="mt-1 w-5 h-5"
                            />
                            <div className="flex-1">
                              <p className="text-white mb-2">{obj.objective}</p>
                              <div className="flex gap-2">
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                  {obj.bloomLevel}
                                </span>
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                                  {obj.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Course Outline */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">📚 Course Structure</h2>

                {/* Duration */}
                <div className="mb-8">
                  <label className="block text-white mb-3">Estimated Course Duration</label>
                  <select
                    value={courseData.estimatedDuration || ''}
                    onChange={(e) => setCourseData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  >
                    <option value="2 weeks">2 weeks</option>
                    <option value="4 weeks">4 weeks</option>
                    <option value="6 weeks">6 weeks</option>
                    <option value="8 weeks">8 weeks</option>
                    <option value="12 weeks">12 weeks</option>
                  </select>
                </div>

                {/* Generate Outline */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateOutline}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 mb-8"
                >
                  <FiZap /> {loading ? 'AI is designing structure...' : 'Generate Course Outline with AI'}
                </motion.button>

                {/* Outline Display */}
                {outlineSuggestion && outlineSuggestion.modules && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">✨ AI-Generated Course Outline</h3>
                      <button
                        onClick={handleGenerateOutline}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg flex items-center gap-2 hover:bg-white/20"
                      >
                        <FiRefreshCw /> Regenerate
                      </button>
                    </div>
                    <div className="space-y-4">
                      {outlineSuggestion.modules.map((module: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={module.title}
                                onChange={(e) => {
                                  const newModules = [...outlineSuggestion.modules];
                                  newModules[index].title = e.target.value;
                                  setOutlineSuggestion({ ...outlineSuggestion, modules: newModules });
                                }}
                                className="w-full bg-transparent text-white text-xl font-bold mb-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                              />
                              <textarea
                                value={module.description}
                                onChange={(e) => {
                                  const newModules = [...outlineSuggestion.modules];
                                  newModules[index].description = e.target.value;
                                  setOutlineSuggestion({ ...outlineSuggestion, modules: newModules });
                                }}
                                className="w-full bg-transparent text-white/60 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                                rows={2}
                              />
                            </div>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                              {module.estimatedDuration}
                            </span>
                          </div>
                          <div className="pl-16">
                            <h4 className="text-white/80 font-semibold mb-2">Topics Covered:</h4>
                            <ul className="space-y-2">
                              {module.topics.map((topic: string, topicIndex: number) => (
                                <li key={topicIndex} className="flex items-center gap-2 text-white/60">
                                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Interactive Components */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">🎮 Interactive Learning Components</h2>
                <p className="text-white/60 mb-8">Select the interactive elements you want to include in your course</p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {INTERACTIVE_TYPES.map((type) => (
                    <motion.div
                      key={type.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const components = courseData.interactiveComponents || [];
                        if (components.includes(type.value)) {
                          setCourseData(prev => ({
                            ...prev,
                            interactiveComponents: components.filter(c => c !== type.value)
                          }));
                        } else {
                          setCourseData(prev => ({
                            ...prev,
                            interactiveComponents: [...components, type.value]
                          }));
                        }
                      }}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                        courseData.interactiveComponents?.includes(type.value)
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className="text-4xl mb-3">{type.icon}</div>
                      <h3 className="text-white font-bold mb-1">{type.label}</h3>
                      <p className="text-white/60 text-xs">{type.description}</p>
                      {courseData.interactiveComponents?.includes(type.value) && (
                        <div className="mt-3">
                          <FiCheck className="text-blue-400 text-xl mx-auto" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: AI Avatar */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">🤖 AI Course Narrator</h2>
                <p className="text-white/60 mb-8">Choose an AI avatar to guide students through your course</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {AI_AVATARS.map((avatar) => (
                    <motion.div
                      key={avatar.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCourseData(prev => ({ ...prev, aiAvatar: avatar.id }))}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                        courseData.aiAvatar === avatar.id
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div className="text-6xl mb-4">{avatar.image}</div>
                      <h3 className="text-white font-bold mb-1">{avatar.name}</h3>
                      <p className="text-white/60 text-sm capitalize">{avatar.voice} voice</p>
                      {courseData.aiAvatar === avatar.id && (
                        <div className="mt-4">
                          <FiCheck className="text-blue-400 text-2xl mx-auto" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white mb-3">Course Category</label>
                  <select
                    value={courseData.category || ''}
                    onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Personal Development">Personal Development</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 6: Review & Generate */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">✨ Review & Generate Course</h2>

                <div className="space-y-6 mb-8">
                  {/* Course Summary */}
                  <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-4">{courseData.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Level</p>
                        <p className="text-white font-semibold capitalize">{courseData.complexity}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Duration</p>
                        <p className="text-white font-semibold">{courseData.estimatedDuration}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Modules</p>
                        <p className="text-white font-semibold">{courseData.outline?.modules?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Interactive</p>
                        <p className="text-white font-semibold">{courseData.interactiveComponents?.length || 0} types</p>
                      </div>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-3">Learning Objectives</h4>
                    <ul className="space-y-2">
                      {courseData.objectives?.map((obj, index) => (
                        <li key={index} className="flex items-start gap-2 text-white/80">
                          <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Components */}
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-3">Interactive Components</h4>
                    <div className="flex flex-wrap gap-2">
                      {courseData.interactiveComponents?.map((comp, index) => {
                        const type = INTERACTIVE_TYPES.find(t => t.value === comp);
                        return (
                          <span key={index} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold flex items-center gap-2">
                            {type?.icon} {type?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateCourse}
                  disabled={loading}
                  className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Generating your course...
                    </>
                  ) : (
                    <>
                      <FiZap className="text-2xl" />
                      Generate Complete Course with AI
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-white/20"
                >
                  <FiArrowLeft /> Back
                </motion.button>
              )}

              {currentStep < STEPS.length && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !courseData.title) ||
                    (currentStep === 2 && (!courseData.objectives || courseData.objectives.length === 0)) ||
                    (currentStep === 3 && !courseData.outline)
                  }
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  Next <FiArrowRight />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
