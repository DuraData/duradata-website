export type LearningBlock = {
  type: "paragraph" | "heading" | "note" | "tip" | "warning" | "list"
  text?: string
  items?: string[]
  level?: number
}

export type QuizQuestionBlueprint = {
  prompt: string
  options: string[]
  correct: number
  explanation: string
}

export type LessonBlueprint = {
  title: string
  slug: string
  minutes: number
  summary: string
  content: LearningBlock[]
  example: { title: string; language: string; sourceCode: string; expectedOutput?: string; explanation: string }
  exercise: { title: string; instructions: string; starterCode: string; expectedAnswer: string; explanation: string }
  questions: QuizQuestionBlueprint[]
}

export type FreeCourseBlueprint = {
  slug: string
  title: string
  shortDescription: string
  description: string
  difficulty: "beginner" | "intermediate"
  durationMinutes: number
  category: string
  tags: string[]
  targetAudience: string
  prerequisites: string
  objectives: string[]
  icon: string
  accent: string
  technology: string
  modules: string[]
  project: {
    title: string
    scenario: string
    requirements: string[]
    acceptanceCriteria: string[]
    stretchGoals: string[]
    submissionGuidance: string
  }
  references: Array<{ label: string; url: string }>
}

const sharedReferences = {
  mdn: { label: "MDN Learn Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
  w3schools: { label: "W3Schools Tutorials", url: "https://www.w3schools.com/" },
  tutorialsPoint: { label: "TutorialsPoint Programming Tutorials", url: "https://www.tutorialspoint.com/index.htm" },
  freeCodeCamp: { label: "freeCodeCamp Curriculum", url: "https://www.freecodecamp.org/learn/" },
}

export const freeCodingCourseBlueprints: FreeCourseBlueprint[] = [
  {
    slug: "html-css-fundamentals",
    title: "HTML & CSS Fundamentals",
    shortDescription: "Build accessible, responsive web pages with semantic HTML and modern CSS.",
    description: "A practical introduction to how browsers turn HTML and CSS into usable websites. Learners create meaningful document structure, accessible forms, flexible layouts, and a responsive final website.",
    difficulty: "beginner", durationMinutes: 540, category: "Web Development",
    tags: ["beginner", "coding", "html", "css", "responsive-design", "accessibility"],
    targetAudience: "New developers, business owners, content professionals, and learners who want to build standards-based websites.",
    prerequisites: "No programming experience is required. Basic computer and file-management skills are helpful.",
    objectives: ["Explain the browser request-and-render cycle", "Create semantic and accessible HTML", "Style layouts with the cascade, Flexbox, and Grid", "Build and test a responsive website"],
    icon: "FileCode2", accent: "from-orange-500 to-blue-600", technology: "html",
    modules: ["How the Web Works", "HTML Document Structure", "Text, Headings and Lists", "Links and Navigation", "Images and Media", "Tables", "Forms and Inputs", "Semantic HTML", "Introduction to CSS", "CSS Selectors", "Colours, Units and Typography", "Box Model", "Flexbox", "CSS Grid", "Responsive Design", "Accessibility Basics", "Final Website Project"],
    project: { title: "Responsive personal or business website", scenario: "A small organisation needs a clear website that works on phones, keyboards, and desktop browsers.", requirements: ["Use semantic landmarks and logical heading levels", "Provide working navigation, responsive media, a data table, and a labelled contact form", "Use Flexbox or Grid for layout", "Apply a mobile-first responsive design"], acceptanceCriteria: ["No horizontal overflow at 320px", "Every form control has a label", "Keyboard focus is visible", "HTML and CSS are separated and readable"], stretchGoals: ["Add a print stylesheet", "Add a dark colour scheme that preserves contrast"], submissionGuidance: "Submit the HTML and CSS files with a README describing accessibility and responsive-design decisions." },
    references: [{ label: "W3Schools HTML", url: "https://www.w3schools.com/html/" }, { label: "W3Schools CSS", url: "https://www.w3schools.com/css/" }, sharedReferences.mdn, sharedReferences.freeCodeCamp],
  },
  {
    slug: "javascript-programming-fundamentals", title: "JavaScript Programming Fundamentals",
    shortDescription: "Learn core JavaScript before frameworks through data, functions, DOM work, events, and async code.",
    description: "A browser-first JavaScript course that builds reliable programming habits before introducing frameworks. Learners practise data modelling, control flow, functions, DOM updates, form validation, JSON, and asynchronous operations.",
    difficulty: "beginner", durationMinutes: 660, category: "Programming",
    tags: ["beginner", "coding", "programming", "javascript", "dom", "async"], targetAudience: "Beginners who want to create interactive web applications or prepare for React and Node.js.", prerequisites: "HTML & CSS Fundamentals is recommended but not required.",
    objectives: ["Write and debug JavaScript programs", "Model information with arrays and objects", "Create accessible browser interactions", "Handle JSON and asynchronous operations safely"], icon: "Braces", accent: "from-yellow-400 to-amber-600", technology: "javascript",
    modules: ["Introduction to JavaScript", "Running JavaScript", "Variables and Constants", "Data Types", "Operators", "Conditions", "Loops", "Functions", "Scope", "Arrays", "Objects", "Strings", "Dates and Numbers", "DOM Introduction", "DOM Manipulation", "Events", "Forms and Validation", "Error Handling", "JSON", "Introduction to Async JavaScript", "Final Project"],
    project: { title: "Interactive task-management application", scenario: "A small team needs a browser-based task list for recording, filtering, completing, and removing work items.", requirements: ["Create, edit, complete, filter, and delete tasks", "Validate user input", "Persist tasks as JSON in local storage", "Show useful empty and error states"], acceptanceCriteria: ["No framework dependency", "All controls work by keyboard", "Invalid input cannot create a task", "Reloading preserves valid tasks"], stretchGoals: ["Add due dates", "Import and export task data as JSON"], submissionGuidance: "Submit HTML, CSS, and JavaScript plus a short manual test checklist." },
    references: [{ label: "W3Schools JavaScript", url: "https://www.w3schools.com/js/" }, { label: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }, sharedReferences.freeCodeCamp],
  },
  {
    slug: "python-programming-for-beginners", title: "Python Programming for Beginners",
    shortDescription: "Learn modern Python 3 by building useful command-line programs and processing business data.",
    description: "A complete beginner path through Python 3 syntax, collections, control flow, functions, modules, exceptions, files, object-oriented basics, packages, and practical data processing.",
    difficulty: "beginner", durationMinutes: 660, category: "Programming", tags: ["beginner", "coding", "programming", "python", "data-processing"], targetAudience: "First-time programmers and professionals who want to automate tasks or prepare for data and backend work.", prerequisites: "No prior programming experience is required.", objectives: ["Write readable Python 3 programs", "Choose appropriate built-in data structures", "Handle files and errors safely", "Build a tested command-line application"], icon: "Code2", accent: "from-blue-500 to-yellow-500", technology: "python",
    modules: ["Introduction to Programming", "Installing and Running Python", "Variables", "Numbers", "Strings", "Booleans", "Lists", "Tuples", "Sets", "Dictionaries", "Conditions", "Loops", "Functions", "Modules", "Exceptions", "Working with Files", "Object-Oriented Programming Basics", "Virtual Environments and Packages", "Basic Data Processing", "Final Project"],
    project: { title: "Command-line expense tracker", scenario: "A self-employed consultant needs a local tool to record expenses and summarise spending by category.", requirements: ["Add, list, filter, and total expenses", "Validate dates and positive amounts", "Persist data in a UTF-8 CSV or JSON file", "Handle missing and malformed files without crashing"], acceptanceCriteria: ["Uses functions with clear responsibilities", "Money is handled consistently", "Errors produce actionable messages", "A README explains how to run the program"], stretchGoals: ["Add monthly budgets", "Export a category report"], submissionGuidance: "Submit source files, representative data, and evidence of at least five manual tests." },
    references: [{ label: "Python 3 Tutorial", url: "https://docs.python.org/3/tutorial/" }, { label: "TutorialsPoint Python", url: "https://www.tutorialspoint.com/python/index.htm" }, sharedReferences.freeCodeCamp],
  },
  {
    slug: "sql-relational-database-fundamentals", title: "SQL & Relational Database Fundamentals",
    shortDescription: "Design relational data and write safe, portable SQL with PostgreSQL-oriented practice.",
    description: "A portable-first SQL course covering tables, constraints, data changes, filtering, aggregation, joins, transactions, indexes, normalisation, and database security, with PostgreSQL examples where specifics are useful.",
    difficulty: "beginner", durationMinutes: 540, category: "Databases", tags: ["beginner", "coding", "sql", "postgresql", "databases", "data-modelling"], targetAudience: "Developers, analysts, administrators, and business professionals who need to store or query structured data.", prerequisites: "No database experience is required.", objectives: ["Explain relational database concepts", "Create constrained tables", "Write useful multi-table queries", "Apply transactions, indexes, normalisation, and safe query practices"], icon: "Database", accent: "from-sky-500 to-indigo-700", technology: "sql",
    modules: ["What Is a Database?", "Relational Databases", "Tables, Rows and Columns", "Data Types", "Primary and Foreign Keys", "CREATE TABLE", "INSERT", "SELECT", "WHERE", "ORDER BY", "LIMIT", "UPDATE", "DELETE", "Aggregate Functions", "GROUP BY", "HAVING", "JOINs", "Subqueries", "Constraints", "Indexes", "Transactions", "Database Design and Normalisation", "SQL Security Basics", "Final Project"],
    project: { title: "Training and course-management database", scenario: "A training provider needs to manage learners, courses, sessions, enrolments, and completion reports.", requirements: ["Design normalised tables and relationships", "Enforce key business rules with constraints", "Insert representative records", "Write at least ten operational and reporting queries"], acceptanceCriteria: ["Foreign keys preserve referential integrity", "Queries use explicit columns and deterministic ordering", "Data changes use safe predicates and transactions", "No query concatenates untrusted input"], stretchGoals: ["Add targeted indexes with justification", "Create a reporting view"], submissionGuidance: "Submit one rerunnable SQL script and a data dictionary explaining every table and key." },
    references: [{ label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }, { label: "W3Schools SQL", url: "https://www.w3schools.com/sql/" }, sharedReferences.tutorialsPoint],
  },
  {
    slug: "git-github-essentials", title: "Git & GitHub Essentials",
    shortDescription: "Track code with Git and collaborate safely through GitHub branches, issues, and pull requests.",
    description: "A practical introduction to local version control with Git and hosted collaboration with GitHub. Learners practise staging, commits, history, branching, merging, remotes, conflict resolution, pull requests, and secret-safe workflows.",
    difficulty: "beginner", durationMinutes: 360, category: "Version Control", tags: ["beginner", "coding", "git", "github", "version-control", "collaboration"], targetAudience: "Learners, developers, analysts, and technical writers who work with versioned files.", prerequisites: "Comfort using files and a terminal is helpful but not required.", objectives: ["Distinguish Git from GitHub", "Create useful local history", "Synchronise repositories safely", "Use branches and pull requests in a collaborative workflow"], icon: "GitBranch", accent: "from-orange-600 to-slate-800", technology: "shell",
    modules: ["What Version Control Solves", "Installing Git", "Repository Basics", "git init", "Working Directory and Staging", "Commits", "Viewing History", "Branches", "Merging", "Resolving Conflicts", "Remotes", "GitHub Repositories", "Clone, Fetch, Pull and Push", ".gitignore", "Pull Requests", "Issues", "Basic Collaborative Workflow", "Commit Message Practices", "Protecting Secrets", "Final Project"],
    project: { title: "Collaborative Git repository", scenario: "Two contributors must improve a small documentation site without overwriting one another's work.", requirements: ["Create a Git repository with README and ignore rules", "Complete work on feature branches", "Open and review pull requests", "Resolve one controlled merge conflict"], acceptanceCriteria: ["History contains focused, meaningful commits", "No credentials or generated dependencies are committed", "Branches merge cleanly into main", "Repository documentation explains the workflow"], stretchGoals: ["Add a pull-request template", "Add a simple automated check"], submissionGuidance: "Submit the GitHub repository URL and a brief reflection identifying Git operations versus GitHub collaboration features." },
    references: [{ label: "Pro Git", url: "https://git-scm.com/book/en/v2" }, { label: "GitHub: Getting started with Git", url: "https://docs.github.com/en/get-started/learning-to-code/getting-started-with-git" }],
  },
  {
    slug: "typescript-fundamentals", title: "TypeScript Fundamentals",
    shortDescription: "Add useful static types to JavaScript with inference, unions, interfaces, generics, and narrowing.",
    description: "A modern TypeScript path for JavaScript learners. The course emphasises useful inference, precise domain models, safe narrowing, practical generics, module boundaries, configuration, and avoiding unnecessary any.",
    difficulty: "intermediate", durationMinutes: 480, category: "Programming", tags: ["coding", "programming", "typescript", "javascript", "types"], targetAudience: "JavaScript developers who want stronger tooling and safer application code.", prerequisites: "JavaScript Programming Fundamentals is recommended.", objectives: ["Model application data with TypeScript", "Use inference and narrowing effectively", "Write reusable typed functions", "Configure and migrate a small JavaScript project"], icon: "FileType2", accent: "from-blue-500 to-blue-800", technology: "typescript",
    modules: ["Why TypeScript?", "Installing TypeScript", "Type Inference", "Primitive Types", "Arrays", "Tuples", "Objects", "Type Aliases", "Interfaces", "Union Types", "Literal Types", "Functions", "Optional Properties", "Generics", "Narrowing", "Classes", "Modules", "Working with Existing JavaScript", "tsconfig", "Avoiding Excessive any", "Final Project"],
    project: { title: "Typed inventory and task application", scenario: "An operations team needs a small application that tracks inventory work without accepting malformed data.", requirements: ["Define domain types for items and tasks", "Use typed functions for create, update, filter, and totals", "Narrow unknown external data before use", "Compile with strict mode"], acceptanceCriteria: ["No unexplained any types", "Invalid states are difficult to represent", "Functions expose clear input and output types", "The project compiles without errors"], stretchGoals: ["Create a reusable generic repository", "Add runtime validation at the JSON boundary"], submissionGuidance: "Submit TypeScript source, tsconfig, compiled output instructions, and examples of compiler errors that prevented defects." },
    references: [{ label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/" }, sharedReferences.freeCodeCamp],
  },
  {
    slug: "react-fundamentals", title: "React Fundamentals",
    shortDescription: "Build accessible component-based interfaces with modern React functions and Hooks.",
    description: "A modern, function-component React course covering JSX, props, state, events, forms, effects, composition, data fetching, routing concepts, performance fundamentals, and accessibility.",
    difficulty: "intermediate", durationMinutes: 660, category: "Frontend Development", tags: ["coding", "javascript", "react", "frontend", "components", "hooks"], targetAudience: "JavaScript learners ready to build maintainable client-side interfaces.", prerequisites: "HTML & CSS Fundamentals and JavaScript Programming Fundamentals are strongly recommended.", objectives: ["Design reusable React components", "Manage local state and events", "Synchronise with external systems carefully", "Build accessible loading, error, and empty states"], icon: "Atom", accent: "from-cyan-400 to-blue-700", technology: "jsx",
    modules: ["What React Solves", "React Project Structure", "Components", "JSX", "Props", "State", "Events", "Conditional Rendering", "Lists and Keys", "Forms", "Hooks", "useState", "useEffect", "Component Composition", "Lifting State", "Data Fetching", "Loading and Error States", "Routing Concepts", "Reusable Components", "Basic Performance Concepts", "Accessibility", "Final Project"],
    project: { title: "Course catalogue and training dashboard", scenario: "A learning team needs a responsive interface for browsing courses and tracking selected training.", requirements: ["Render course data through reusable components", "Support search, filtering, and saved selections", "Handle loading, empty, success, and error states", "Use semantic HTML and labelled controls"], acceptanceCriteria: ["Uses function components and Hooks", "State has one clear owner", "List keys are stable data identifiers", "No effect is used for a value that can be calculated during render"], stretchGoals: ["Add client-side routing", "Measure and improve one proven performance bottleneck"], submissionGuidance: "Submit source, setup instructions, component notes, and a short accessibility test record." },
    references: [{ label: "React Learn", url: "https://react.dev/learn" }, { label: "MDN Accessibility", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility" }],
  },
  {
    slug: "nodejs-rest-api-development", title: "Node.js & REST API Development",
    shortDescription: "Create secure JSON APIs with Node.js, validation, authentication concepts, logging, and tests.",
    description: "A security-conscious introduction to backend JavaScript and REST. Learners design HTTP resources, validate input, separate middleware, handle errors, integrate persistence, protect passwords and secrets, authorise operations, log safely, and test API behaviour.",
    difficulty: "intermediate", durationMinutes: 660, category: "Backend Development", tags: ["coding", "javascript", "nodejs", "api", "rest", "backend", "security"], targetAudience: "JavaScript developers moving into backend and full-stack development.", prerequisites: "JavaScript Programming Fundamentals is recommended.", objectives: ["Explain HTTP and REST trade-offs", "Build validated JSON endpoints", "Apply authentication and authorization boundaries", "Test and operate an API without leaking sensitive data"], icon: "Server", accent: "from-green-500 to-slate-800", technology: "javascript",
    modules: ["Backend Development Concepts", "Node.js Runtime", "npm", "Modules", "Environment Variables", "HTTP Fundamentals", "REST Principles", "Creating an HTTP and API Server", "Routing", "Request Parameters", "Request Bodies", "JSON APIs", "Validation", "Error Handling", "Middleware", "Database Integration Concepts", "Authentication Concepts", "Password Hashing", "Authorization", "Security Basics", "Logging", "API Testing", "Final Project"],
    project: { title: "Training management REST API", scenario: "A training provider needs an API for courses, learners, enrolments, and progress.", requirements: ["Implement versioned resource routes and JSON responses", "Validate every external input", "Use parameterised persistence and hashed passwords", "Enforce server-side authorization and safe error handling"], acceptanceCriteria: ["Secrets come from environment variables", "No plaintext password is stored or logged", "Production errors do not expose stack traces", "Automated tests cover success, validation, authentication, authorization, and not-found cases"], stretchGoals: ["Add rate limits", "Add request correlation IDs and structured logs"], submissionGuidance: "Submit source, environment-variable template without secrets, API documentation, and passing test output." },
    references: [{ label: "Node.js Learn", url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs" }, { label: "OWASP API Security", url: "https://owasp.org/www-project-api-security/" }],
  },
  {
    slug: "csharp-dotnet-fundamentals", title: "C# & .NET Fundamentals",
    shortDescription: "Learn modern C# and .NET through typed programs, object modelling, LINQ, async code, and ASP.NET Core.",
    description: "A modern C# course covering syntax, control flow, collections, classes, encapsulation, interfaces, exceptions, LINQ, async/await, files, and a first ASP.NET Core application.",
    difficulty: "beginner", durationMinutes: 660, category: "Microsoft Development", tags: ["beginner", "coding", "programming", "csharp", "dotnet", "aspnet-core"], targetAudience: "Beginners and developers who want to build business applications on the modern .NET platform.", prerequisites: "No C# experience is required. General programming concepts are helpful.", objectives: ["Build and run modern .NET applications", "Use C# types and control flow", "Model business rules with classes and interfaces", "Apply LINQ, async/await, files, and ASP.NET Core fundamentals"], icon: "Boxes", accent: "from-purple-500 to-indigo-800", technology: "csharp",
    modules: ["Introduction to .NET", "C# Syntax", "Variables", "Data Types", "Operators", "Conditions", "Loops", "Methods", "Arrays", "Collections", "Classes", "Objects", "Properties", "Constructors", "Encapsulation", "Inheritance", "Interfaces", "Exceptions", "LINQ Fundamentals", "Async and Await Basics", "File Handling", "Introduction to ASP.NET Core", "Final Project"],
    project: { title: "Employee and course registration application", scenario: "A training coordinator needs a small .NET application that registers employees for courses and produces simple reports.", requirements: ["Model employees, courses, and registrations", "Validate duplicates and capacity", "Persist data to a file or small database", "Provide an ASP.NET Core or console interface"], acceptanceCriteria: ["Nullable values are handled deliberately", "Business rules live outside presentation code", "Exceptions are caught only where recovery is possible", "Async methods use Task and are awaited"], stretchGoals: ["Add a minimal API", "Add LINQ-based attendance reports"], submissionGuidance: "Submit the solution, run instructions, representative data, and a description of the domain model." },
    references: [{ label: "Microsoft Learn: C#", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" }, { label: ".NET documentation", url: "https://learn.microsoft.com/en-us/dotnet/" }],
  },
  {
    slug: "data-structures-algorithms-problem-solving", title: "Data Structures, Algorithms & Problem Solving",
    shortDescription: "Choose effective data structures and reason about algorithms with Python and clear pseudocode.",
    description: "A practical problem-solving course covering decomposition, complexity intuition, core linear and linked structures, recursion, searching, elementary sorting, merge-sort concepts, trees, graphs, and evidence-based algorithm selection.",
    difficulty: "intermediate", durationMinutes: 660, category: "Computer Science", tags: ["coding", "programming", "algorithms", "data-structures", "python", "problem-solving"], targetAudience: "Learners with basic programming experience who want stronger reasoning and interview-independent problem-solving skills.", prerequisites: "Python Programming for Beginners or equivalent experience is recommended.", objectives: ["Decompose problems into testable steps", "Estimate time and space growth", "Implement and compare core data structures and algorithms", "Select an approach from real constraints rather than memorisation"], icon: "Network", accent: "from-rose-500 to-violet-700", technology: "python",
    modules: ["Problem Solving", "Algorithms", "Complexity", "Big O Intuition", "Arrays", "Strings", "Stacks", "Queues", "Linked Lists", "Hash Tables", "Sets", "Recursion", "Searching", "Linear Search", "Binary Search", "Sorting Concepts", "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort Concepts", "Trees", "Graph Fundamentals", "Practical Algorithm Selection", "Final Challenges"],
    project: { title: "Practical algorithm challenge set", scenario: "A software team needs efficient solutions for inventory lookup, task scheduling, duplicate detection, hierarchy traversal, and route discovery.", requirements: ["Solve at least six problems", "State the chosen data structure", "Explain expected time and space complexity", "Test normal, empty, boundary, and duplicate cases"], acceptanceCriteria: ["Solutions are correct and readable", "Complexity claims match the implementation", "Binary search is used only on ordered data", "Every solution includes evidence from tests"], stretchGoals: ["Compare two valid approaches empirically", "Implement a breadth-first graph traversal"], submissionGuidance: "Submit code or pseudocode, tests, and a short decision record for every problem." },
    references: [{ label: "Python Data Structures", url: "https://docs.python.org/3/tutorial/datastructures.html" }, sharedReferences.freeCodeCamp],
  },
]

function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function topicExplanation(topic: string, course: FreeCourseBlueprint) {
  const lower = topic.toLowerCase()
  if (lower.includes("final")) return `This capstone combines the earlier ${course.title} skills into one coherent product. The goal is not a large codebase; it is a small solution whose behaviour, decisions, and limitations you can explain.`
  if (lower.includes("security") || lower.includes("secret") || lower.includes("password")) return "Security depends on boundaries. Treat all external data as untrusted, keep credentials out of source control, perform authorization on the server, use maintained password-hashing libraries, and expose only information a caller is permitted to see."
  if (lower.includes("accessib")) return "Accessibility means people can perceive, understand, navigate, and operate the interface with different devices and abilities. Start with semantic elements, keyboard support, programmatic labels, useful alternative text, visible focus, and sufficient contrast."
  if (lower.includes("async") || lower.includes("await")) return "Asynchronous work lets a program continue while an external operation is pending. The important skill is controlling when results become available, handling rejection, preserving meaningful error context, and avoiding accidental parallel or sequential execution."
  if (lower.includes("database") || lower.includes("table") || lower.includes("relational")) return "A relational model stores facts in tables and connects them through keys. Good design gives each fact one reliable home, applies constraints close to the data, and supports the questions the application must answer."
  if (lower.includes("git") || lower.includes("commit") || lower.includes("branch") || lower.includes("merge") || lower.includes("remote") || lower.includes("pull request")) return "Git records a local history of snapshots; GitHub hosts Git repositories and adds collaboration services. Keep those roles distinct so commands, network operations, review, and project management remain easy to reason about."
  if (lower.includes("type") || lower.includes("interface") || lower.includes("generic") || lower.includes("narrow")) return "A useful type describes the values the program can safely accept and produce. Prefer inference for obvious local values, explicit types at important boundaries, and narrowing before using data that might have several shapes."
  if (lower.includes("component") || lower.includes("react") || lower.includes("jsx") || lower.includes("state") || lower.includes("hook")) return "React components describe interface output from props and state. Keep rendering pure, give state a clear owner, use stable identities for lists, and reserve effects for synchronising with systems outside React."
  if (lower.includes("loop") || lower.includes("recursion")) return "Repeated work needs an explicit stopping condition and a clear change on every step. Trace a small input by hand, identify the invariant that remains true, and test empty and boundary inputs before assuming the repetition is correct."
  if (lower.includes("function") || lower.includes("method")) return "A well-designed function has a clear purpose, explicit inputs, a predictable result, and a name that communicates intent. Small functions reduce duplication, make testing easier, and isolate change."
  if (lower.includes("array") || lower.includes("list") || lower.includes("collection") || lower.includes("set") || lower.includes("dictionary") || lower.includes("hash")) return "Data structures encode how values are organised and which operations should be cheap. Choose from required operations—ordering, lookup, uniqueness, insertion, and traversal—rather than choosing from habit."
  if (lower.includes("http") || lower.includes("rest") || lower.includes("api") || lower.includes("request") || lower.includes("json")) return "An API is a contract between independently changing systems. Define resources, methods, status codes, payload shapes, validation, authorization, and errors deliberately; never assume the client has enforced a rule."
  if (lower.includes("error") || lower.includes("exception")) return "Errors are part of a program's public behaviour. Detect problems near their source, preserve enough context to diagnose them, recover only when the program has a safe alternative, and present users with actionable messages."
  if (lower.includes("search") || lower.includes("sort") || lower.includes("complex") || lower.includes("big o")) return "Algorithm analysis compares how resource use grows as input grows. Correctness comes first; then use the real size, ordering, update frequency, and latency needs to decide whether a more complex approach earns its cost."
  if (lower.includes("form") || lower.includes("input") || lower.includes("valid")) return "Input handling is a boundary: give people clear labels and constraints, validate for usability in the interface, and validate again at the trusted processing boundary. Invalid input should produce specific guidance rather than a mysterious failure."
  return `${topic} is a working part of ${course.title}, not an isolated definition. Learn the purpose, observe the behaviour in a small example, practise changing it, and then decide when it belongs in a larger solution.`
}

function exampleFor(course: FreeCourseBlueprint, topic: string, index: number) {
  const safeTopic = topic.replace(/`/g, "")
  switch (course.technology) {
    case "html": return { language: index > 7 ? "css" : "html", sourceCode: index > 7 ? `.course-card {\n  display: grid;\n  gap: 1rem;\n  padding: 1.25rem;\n  border: 1px solid #cbd5e1;\n}\n\n@media (min-width: 48rem) {\n  .course-card { grid-template-columns: 2fr 1fr; }\n}` : `<section aria-labelledby="course-heading">\n  <h2 id="course-heading">${safeTopic}</h2>\n  <p>Practical training for growing teams.</p>\n  <a href="/courses">View courses</a>\n</section>`, expectedOutput: index > 7 ? "A single-column card that becomes two columns on wider screens." : `A semantic section headed “${safeTopic}” with a working course link.` }
    case "javascript": return { language: "javascript", sourceCode: `const learningTask = { title: "Practise ${safeTopic}", completed: false };\n\nfunction toggleTask(task) {\n  return { ...task, completed: !task.completed };\n}\n\nconsole.log(toggleTask(learningTask));`, expectedOutput: `{ title: 'Practise ${safeTopic}', completed: true }` }
    case "python": return { language: "python", sourceCode: `records = [\n    {"category": "Training", "amount": 240},\n    {"category": "Transport", "amount": 85},\n]\n\ndef total_amount(items):\n    return sum(item["amount"] for item in items)\n\nprint(f"Total: R{total_amount(records)}")`, expectedOutput: "Total: R325" }
    case "sql": return { language: "sql", sourceCode: `SELECT c.title, COUNT(e.id) AS enrolment_count\nFROM courses AS c\nLEFT JOIN enrolments AS e ON e.course_id = c.id\nGROUP BY c.id, c.title\nORDER BY enrolment_count DESC, c.title ASC;`, expectedOutput: "One row per course, including courses with zero enrolments, ordered by enrolment count." }
    case "shell": return { language: "shell", sourceCode: `git status\ngit switch -c feature/${slugify(safeTopic)}\ngit add README.md\ngit commit -m "docs: explain ${safeTopic.toLowerCase()}"\ngit log --oneline -3`, expectedOutput: "A new branch with one focused commit and a short readable history." }
    case "typescript": return { language: "typescript", sourceCode: `type LearningTask = {\n  id: string;\n  title: string;\n  status: "planned" | "complete";\n};\n\nfunction complete(task: LearningTask): LearningTask {\n  return { ...task, status: "complete" };\n}\n\nconsole.log(complete({ id: "task-1", title: "${safeTopic}", status: "planned" }));`, expectedOutput: `{ id: 'task-1', title: '${safeTopic}', status: 'complete' }` }
    case "jsx": return { language: "jsx", sourceCode: `function CourseStatus({ title, complete }) {\n  return (\n    <article aria-labelledby="course-title">\n      <h2 id="course-title">{title}</h2>\n      <p>{complete ? "Complete" : "In progress"}</p>\n    </article>\n  );\n}\n\nexport default function App() {\n  return <CourseStatus title="${safeTopic}" complete={false} />;\n}`, expectedOutput: `A component displaying “${safeTopic}” and “In progress”.` }
    case "csharp": return { language: "csharp", sourceCode: `var registrations = new List<Registration>\n{\n    new("Amina", "${safeTopic}", true),\n    new("Thabo", "${safeTopic}", false)\n};\n\nvar confirmed = registrations.Where(item => item.Confirmed);\nforeach (var item in confirmed)\n{\n    Console.WriteLine($"{item.Employee}: {item.Course}");\n}\n\npublic record Registration(string Employee, string Course, bool Confirmed);`, expectedOutput: `Amina: ${safeTopic}` }
    default: return { language: "text", sourceCode: `INPUT: a realistic ${safeTopic.toLowerCase()} problem\n1. State the required output.\n2. List constraints and edge cases.\n3. Choose a data structure.\n4. Write and trace the algorithm.\n5. Test normal and boundary inputs.`, expectedOutput: "A traceable solution plan with explicit constraints and tests." }
  }
}

function buildLesson(course: FreeCourseBlueprint, topic: string, index: number): LessonBlueprint {
  const isProject = index === course.modules.length - 1
  const minutes = Math.round(course.durationMinutes / course.modules.length)
  const explanation = topicExplanation(topic, course)
  const example = exampleFor(course, topic, index)
  const practiceTarget = isProject ? course.project.title : `${topic} in a small training or business scenario`
  const content: LearningBlock[] = [
    { type: "heading", level: 2, text: "Learning objectives" },
    { type: "list", items: [`Explain what ${topic.toLowerCase()} contributes to a working solution`, `Apply ${topic.toLowerCase()} in a small, testable example`, `Recognise a common failure and improve the implementation`] },
    { type: "heading", level: 2, text: "Why this matters" },
    { type: "paragraph", text: `${topic} matters because software is maintained, tested, and used under real constraints. In this lesson you will connect the concept to ${course.title}, inspect a focused example, and practise making a deliberate change. The aim is understanding you can transfer to a new problem, not memorising one finished answer.` },
    { type: "heading", level: 2, text: "Concept explanation" },
    { type: "paragraph", text: explanation },
    { type: "paragraph", text: `Start by naming the information that enters the operation, the result that must leave it, and the rules that must remain true. Work through one normal case on paper before writing code. Then add an empty case, a boundary case, and an invalid case. This rhythm exposes assumptions early and makes ${topic.toLowerCase()} easier to debug.` },
    { type: "paragraph", text: `The worked example uses a compact training-system scenario so every line has a recognisable purpose. Run it before changing it. Predict the result, compare the actual output with the prediction, and explain any difference. Change one value or rule at a time; changing several things at once hides which decision produced the new behaviour.` },
    { type: "heading", level: 2, text: "Common mistakes" },
    { type: "warning", text: `A frequent mistake is treating ${topic.toLowerCase()} as syntax to copy without checking its assumptions. That leads to code that appears correct for one demonstration but fails with missing, repeated, unordered, very large, or unauthorised input. Keep the example small, but make the reasoning explicit.` },
    { type: "heading", level: 2, text: "Recommended practice" },
    { type: "list", items: ["Use names that describe business meaning", "Keep each operation small enough to test independently", "Validate at trust boundaries and report useful errors", "Prefer the clearest correct solution before optimising", "Record why a non-obvious decision was made"] },
    { type: "tip", text: `After the first successful run, explain ${topic.toLowerCase()} aloud without looking at the code. If the explanation is unclear, reduce the example and trace it again.` },
    { type: "heading", level: 2, text: "Hands-on work" },
    { type: "paragraph", text: `Complete the exercise by applying the idea to ${practiceTarget}. Do not paste the worked example unchanged. Identify the rule that differs, implement that rule, and verify the expected result with at least one additional input of your own.` },
    ...(isProject ? [
      { type: "heading" as const, level: 2, text: "Project brief" },
      { type: "paragraph" as const, text: course.project.scenario },
      { type: "heading" as const, level: 3, text: "Requirements" },
      { type: "list" as const, items: course.project.requirements },
      { type: "heading" as const, level: 3, text: "Minimum acceptance criteria" },
      { type: "list" as const, items: course.project.acceptanceCriteria },
      { type: "heading" as const, level: 3, text: "Optional stretch goals" },
      { type: "list" as const, items: course.project.stretchGoals },
      { type: "note" as const, text: course.project.submissionGuidance },
    ] : []),
    { type: "heading", level: 2, text: "Lesson summary" },
    { type: "paragraph", text: `${topic} is now part of your working toolkit. You have identified its purpose, read an executable example, considered failure cases, and applied the idea in a different scenario. Keep the exercise because later lessons and the final project assume you can revisit and improve earlier work.` },
  ]

  return {
    title: topic,
    slug: slugify(topic),
    minutes,
    summary: isProject ? `Combine the course skills to complete ${course.project.title}.` : `Understand ${topic.toLowerCase()}, inspect a practical example, and apply it independently.`,
    content,
    example: { title: `Worked example: ${topic}`, ...example, explanation: `This example keeps the data small and the names meaningful so the behaviour is visible. Trace it in execution order, confirm the stated result, then alter one input and predict the new result before running it again.` },
    exercise: {
      title: isProject ? `Plan ${course.project.title}` : `Apply ${topic}`,
      instructions: isProject ? `Create an implementation plan that maps every requirement to a feature and every acceptance criterion to a test. Then build the smallest end-to-end version before adding stretch goals.` : `Modify the worked example for a different course, employee, customer, inventory, booking, or reporting rule. Include one valid boundary case and one invalid case, then state the expected result for each.`,
      starterCode: `${example.sourceCode}\n\n${course.technology === "python" ? "# TODO: adapt the data and add boundary checks" : course.technology === "sql" ? "-- TODO: adapt the query and add a safe filter" : "// TODO: adapt the scenario and add boundary checks"}`,
      expectedAnswer: `A valid solution keeps the example's core ${topic.toLowerCase()} principle, uses different meaningful data, handles the stated boundary case, rejects or reports the invalid case, and produces the learner's predicted result. More than one implementation can satisfy these requirements.`,
      explanation: "Compare behaviour against the requirements rather than comparing text character-for-character. A strong answer is correct, readable, and supported by evidence from the added cases.",
    },
    questions: [
      { prompt: `What is the best evidence that you understand ${topic}?`, options: ["You can copy the example exactly", "You can explain it, adapt it, and verify a new case", "You remember every symbol", "You made the solution as long as possible"], correct: 1, explanation: "Transfer and verification demonstrate understanding; copying or memorising syntax does not show that the underlying idea is clear." },
      { prompt: `Which practice is most reliable when applying ${topic.toLowerCase()}?`, options: ["Change several rules before testing", "Ignore invalid inputs", "Define the expected result and test boundary cases", "Optimise before establishing correctness"], correct: 2, explanation: "An explicit expected result plus boundary tests makes assumptions visible and provides evidence that the implementation is correct." },
    ],
  }
}

export function buildFreeCodingLibrary() {
  return freeCodingCourseBlueprints.map((course) => ({
    ...course,
    lessons: course.modules.map((topic, index) => buildLesson(course, topic, index)),
  }))
}

export const FREE_CODING_LIBRARY_VERSION = 1
export const FREE_CODING_LIBRARY_MANAGED_PREFIX = "duradata-free-coding"
export const FREE_CODING_LIBRARY_SLUGS = freeCodingCourseBlueprints.map((course) => course.slug)
export const FREE_CODING_LIBRARY_MANAGED_KEYS = FREE_CODING_LIBRARY_SLUGS.map(
  (slug) => `${FREE_CODING_LIBRARY_MANAGED_PREFIX}:${slug}`,
)
