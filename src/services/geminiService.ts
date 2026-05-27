import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI - You'll need to add your API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDemoKeyPleaseReplaceWithReal';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface CourseTitleSuggestion {
  title: string;
  description: string;
  relevance: number;
}

export interface LearningObjective {
  objective: string;
  bloomLevel: string;
  category: string;
}

export interface CourseOutline {
  modules: Array<{
    title: string;
    description: string;
    topics: string[];
    estimatedDuration: string;
  }>;
}

export interface InteractiveComponent {
  type: string;
  title: string;
  description: string;
  difficulty: string;
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Step 1: Generate Course Title Suggestions
  async generateCourseTitles(keywords: string[], targetAudience: string): Promise<CourseTitleSuggestion[]> {
    const prompt = `You are an expert course designer. Generate 5 engaging and professional course titles based on these keywords: ${keywords.join(', ')}.

Target Audience: ${targetAudience}

For each title, provide:
1. A catchy, professional course title (max 60 characters)
2. A compelling 1-sentence description
3. A relevance score (0-100)

Format your response as valid JSON array:
[
  {
    "title": "Course Title Here",
    "description": "Description here",
    "relevance": 95
  }
]

Make titles engaging, specific, and market-ready.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackTitles(keywords);
    } catch (error) {
      console.error('Error generating titles:', error);
      return this.getFallbackTitles(keywords);
    }
  }

  // Step 2: Generate Learning Objectives
  async generateLearningObjectives(
    courseTitle: string,
    keywords: string[],
    complexity: string,
    targetAudience: string
  ): Promise<LearningObjective[]> {
    const prompt = `You are an expert instructional designer. Create 6-8 SMART learning objectives for this course:

Course Title: ${courseTitle}
Keywords: ${keywords.join(', ')}
Complexity Level: ${complexity}
Target Audience: ${targetAudience}

Use Bloom's Taxonomy. For each objective, provide:
1. A clear, measurable learning objective starting with an action verb
2. The Bloom's taxonomy level (Remember, Understand, Apply, Analyze, Evaluate, Create)
3. Category (Knowledge, Skills, Attitudes)

Format as valid JSON:
[
  {
    "objective": "By the end of this course, learners will be able to...",
    "bloomLevel": "Apply",
    "category": "Skills"
  }
]

Make objectives specific, measurable, achievable, relevant, and time-bound.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackObjectives(courseTitle);
    } catch (error) {
      console.error('Error generating objectives:', error);
      return this.getFallbackObjectives(courseTitle);
    }
  }

  // Step 3: Generate Course Outline
  async generateCourseOutline(
    courseTitle: string,
    objectives: string[],
    complexity: string,
    estimatedDuration: string
  ): Promise<CourseOutline> {
    const prompt = `You are an expert curriculum designer. Create a detailed course outline:

Course Title: ${courseTitle}
Learning Objectives: ${objectives.join('; ')}
Complexity: ${complexity}
Total Duration: ${estimatedDuration}

Create 4-6 modules. For each module include:
1. Module title
2. Brief description (1-2 sentences)
3. 3-5 specific topics covered
4. Estimated duration

Format as valid JSON:
{
  "modules": [
    {
      "title": "Module 1: Introduction",
      "description": "Description here",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "estimatedDuration": "2 hours"
    }
  ]
}

Ensure logical progression from beginner to advanced concepts.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackOutline(courseTitle);
    } catch (error) {
      console.error('Error generating outline:', error);
      return this.getFallbackOutline(courseTitle);
    }
  }

  // Step 4: Generate Interactive Component Suggestions
  async generateInteractiveComponents(
    courseTitle: string,
    modules: string[],
    selectedTypes: string[]
  ): Promise<InteractiveComponent[]> {
    const prompt = `You are an expert in interactive learning design. Suggest engaging interactive components for this course:

Course Title: ${courseTitle}
Modules: ${modules.join(', ')}
Selected Types: ${selectedTypes.join(', ')}

For each selected type, create 2-3 specific, creative interactive activities. Include:
1. Activity title
2. Description of what learners will do
3. Difficulty level

Format as valid JSON array:
[
  {
    "type": "Quiz",
    "title": "Module 1 Knowledge Check",
    "description": "10-question multiple choice quiz covering key concepts",
    "difficulty": "beginner"
  }
]

Make activities engaging, varied, and aligned with learning objectives.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackComponents(selectedTypes);
    } catch (error) {
      console.error('Error generating components:', error);
      return this.getFallbackComponents(selectedTypes);
    }
  }

  // Generate Full Course Content
  async generateCourseContent(
    outline: CourseOutline,
    interactiveTypes: string[],
    complexity: string
  ): Promise<any> {
    const prompt = `You are an expert content creator. Generate complete course content:

Course Outline: ${JSON.stringify(outline)}
Interactive Types: ${interactiveTypes.join(', ')}
Complexity: ${complexity}

For each module, generate:
1. Detailed lesson content (markdown format)
2. Key takeaways (bullet points)
3. Practical examples
4. Assessment questions
5. Additional resources

Format as valid JSON with rich content for each module.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { modules: [] };
    } catch (error) {
      console.error('Error generating content:', error);
      return { modules: [] };
    }
  }

  // Generate Quiz Questions
  async generateQuizQuestions(
    topic: string,
    difficulty: string,
    count: number = 10
  ): Promise<any[]> {
    const prompt = `Generate ${count} multiple-choice quiz questions on: ${topic}

Difficulty: ${difficulty}

For each question, provide:
1. Question text
2. 4 answer options (A, B, C, D)
3. Correct answer (letter)
4. Explanation

Format as valid JSON array.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return [];
    } catch (error) {
      console.error('Error generating quiz:', error);
      return [];
    }
  }

  // Generate Flashcards
  async generateFlashcards(topic: string, count: number = 20): Promise<any[]> {
    const prompt = `Generate ${count} flashcards on: ${topic}

Format as JSON:
[
  {
    "front": "Question or term",
    "back": "Answer or definition",
    "category": "Category name"
  }
]`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return [];
    } catch (error) {
      console.error('Error generating flashcards:', error);
      return [];
    }
  }

  // Generate Case Study
  async generateCaseStudy(topic: string, complexity: string): Promise<any> {
    const prompt = `Create a detailed case study on: ${topic}
Complexity: ${complexity}

Include:
1. Scenario description
2. Background information
3. Key challenges
4. Discussion questions
5. Learning points

Format as valid JSON.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {};
    } catch (error) {
      console.error('Error generating case study:', error);
      return {};
    }
  }

  // Fallback methods when AI fails
  private getFallbackTitles(keywords: string[]): CourseTitleSuggestion[] {
    return [
      {
        title: `Mastering ${keywords[0] || 'the Subject'}`,
        description: 'A comprehensive course covering essential concepts and practical applications.',
        relevance: 85
      },
      {
        title: `${keywords[0] || 'Subject'} Fundamentals`,
        description: 'Build a solid foundation with this structured learning program.',
        relevance: 80
      },
      {
        title: `Advanced ${keywords[0] || 'Subject'} Techniques`,
        description: 'Take your skills to the next level with advanced strategies.',
        relevance: 75
      }
    ];
  }

  private getFallbackObjectives(courseTitle: string): LearningObjective[] {
    return [
      {
        objective: `Understand the core concepts of ${courseTitle}`,
        bloomLevel: 'Understand',
        category: 'Knowledge'
      },
      {
        objective: `Apply key principles in practical scenarios`,
        bloomLevel: 'Apply',
        category: 'Skills'
      },
      {
        objective: `Analyze complex problems and develop solutions`,
        bloomLevel: 'Analyze',
        category: 'Skills'
      }
    ];
  }

  private getFallbackOutline(courseTitle: string): CourseOutline {
    return {
      modules: [
        {
          title: 'Introduction',
          description: 'Getting started with the fundamentals',
          topics: ['Overview', 'Key Concepts', 'Prerequisites'],
          estimatedDuration: '2 hours'
        },
        {
          title: 'Core Concepts',
          description: 'Deep dive into essential topics',
          topics: ['Topic 1', 'Topic 2', 'Topic 3'],
          estimatedDuration: '4 hours'
        },
        {
          title: 'Practical Applications',
          description: 'Hands-on practice and real-world examples',
          topics: ['Application 1', 'Application 2', 'Best Practices'],
          estimatedDuration: '3 hours'
        }
      ]
    };
  }

  private getFallbackComponents(types: string[]): InteractiveComponent[] {
    const components: InteractiveComponent[] = [];

    types.forEach(type => {
      components.push({
        type,
        title: `${type} Activity`,
        description: `Engaging ${type.toLowerCase()} to reinforce learning`,
        difficulty: 'intermediate'
      });
    });

    return components;
  }
}

export const geminiService = new GeminiService();
