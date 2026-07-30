import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function seedFullCoursesWithFaculty() {
  console.log("🚀 Seeding 6 Real Instructors with Login Variants & 12 CS Courses into Supabase...");

  // 1. Create Faculty of 6 Instructors with Clerk Test Email Variants
  const facultyMembers = [
    {
      name: "Muhammad Abdullah",
      handle: "muhammad.abdullah",
      emails: [
        "muhammad.abdullah@courseforge.com",
        "abdullah+clerk_test@example.com",
        "muhammad.abdullah+clerk_test@example.com",
        "abdullah@example.com",
      ],
    },
    {
      name: "Dr. Sarah Jenkins",
      handle: "sarah.jenkins",
      emails: [
        "sarah.jenkins@courseforge.com",
        "sarah+clerk_test@example.com",
        "sarah.jenkins+clerk_test@example.com",
        "sarah.jenkins@example.com",
      ],
    },
    {
      name: "Dr. Alex Chen",
      handle: "alex.chen",
      emails: [
        "alex.chen@courseforge.com",
        "alex+clerk_test@example.com",
        "alex.chen+clerk_test@example.com",
        "alex.chen@example.com",
      ],
    },
    {
      name: "Prof. Marcus Vance",
      handle: "marcus.vance",
      emails: [
        "marcus.vance@courseforge.com",
        "marcus+clerk_test@example.com",
        "marcus.vance+clerk_test@example.com",
        "marcus.vance@example.com",
      ],
    },
    {
      name: "Elena Rostova",
      handle: "elena.rostova",
      emails: [
        "elena.rostova@courseforge.com",
        "elena+clerk_test@example.com",
        "elena.rostova+clerk_test@example.com",
        "elena.rostova@example.com",
      ],
    },
    {
      name: "David K. Miller",
      handle: "david.miller",
      emails: [
        "david.miller@courseforge.com",
        "david+clerk_test@example.com",
        "david.miller+clerk_test@example.com",
        "david.miller@example.com",
      ],
    },
  ];

  const instructorMap: Record<string, string> = {};

  for (const fac of facultyMembers) {
    console.log(`\n👨‍🏫 Faculty Member: ${fac.name}`);
    let primaryUserId: string | null = null;

    for (const email of fac.emails) {
      const fakeClerkId = `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;

      const user = await prisma.user.upsert({
        where: { email },
        update: { role: "INSTRUCTOR" },
        create: {
          clerkId: fakeClerkId,
          email,
          role: "INSTRUCTOR",
        },
      });

      if (!primaryUserId) {
        primaryUserId = user.id;
      }
      console.log(`   └─ Registered login email: ${email}`);
    }

    if (primaryUserId) {
      instructorMap[fac.name] = primaryUserId;
    }
  }

  const coursesData = [
    // Course 1: Data Structures & Algorithms
    {
      instructorName: "Dr. Sarah Jenkins",
      title: "Data Structures & Algorithms (DSA)",
      description: "Master essential computer science data structures, graph algorithms, dynamic programming, and Big O time complexity analysis.",
      published: true,
      lessons: [
        { title: "Module 1: Introduction to Data Structures & Big O Notation", content: "# Big O Notation & Complexity Analysis\nLearn how to evaluate algorithm efficiency using Big O notation for time and space complexity." },
        { title: "Module 2: Arrays, Vectors & Dynamic Memory Allocation", content: "# Arrays & Contiguous Memory\nUnderstand static arrays, dynamic vectors, pointer arithmetic, and memory allocation in modern C++." },
        { title: "Module 3: Singly & Doubly Linked Lists", content: "# Linked Lists Architecture\nImplement node pointers, head/tail insertion, deletion, and reversal of singly and doubly linked lists." },
        { title: "Module 4: Stacks (LIFO) & Evaluation of Expressions", content: "# Stacks & Recursion\nLearn Last-In-First-Out data flow, expression parsing (Infix to Postfix), and function call stacks." },
        { title: "Module 5: Queues (FIFO), Circular Queues & Deques", content: "# Queues & Buffer Management\nImplement First-In-First-Out queues, circular ring buffers, and double-ended queues for task scheduling." },
        { title: "Module 6: Sorting Algorithms (Bubble, Selection, Insertion)", content: "# Quadratic Sorting Algorithms\nAnalyze baseline sorting techniques, loop invariants, and swap mechanics with O(N^2) complexity." },
        { title: "Module 7: Divide & Conquer (Quick Sort & Merge Sort)", content: "# Fast Sorting & Recurrences\nImplement Merge Sort and Quick Sort with recursive partitioning achieving O(N log N) performance." },
        { title: "Module 8: Binary Trees & Tree Traversals", content: "# Tree Structures\nLearn tree nodes, root/leaf concepts, and pre-order, in-order, and post-order traversal algorithms." },
        { title: "Module 9: Binary Search Trees (BST) & AVL Balancing", content: "# BST Operations\nImplement BST insertion, searching, deletion, and self-balancing AVL tree rotations." },
        { title: "Module 10: Hash Tables & Collision Resolution", content: "# Hash Maps & Constant Lookups\nExplore hash functions, separate chaining, open addressing, and load factor resizing." },
        { title: "Module 11: Graph Representation & Traversal (BFS & DFS)", content: "# Graph Theory Essentials\nRepresent graphs using Adjacency Matrices and Lists. Master Breadth-First Search and Depth-First Search." },
        { title: "Module 12: Dynamic Programming & Greedy Algorithms", content: "# Optimal Substructure & Memoization\nSolve classic DP problems including Fibonacci, Knapsack, and Longest Common Subsequence." },
      ],
    },

    // Course 2: Object-Oriented Programming (OOP)
    {
      instructorName: "Elena Rostova",
      title: "Object-Oriented Programming (OOP)",
      description: "Master modern software engineering concepts including encapsulation, inheritance, polymorphism, design patterns, and SOLID principles.",
      published: true,
      lessons: [
        { title: "Module 1: Paradigm Shift: Procedural vs Object-Oriented", content: "# Object-Oriented Philosophy\nUnderstand how OOP models real-world domain entities into reusable state (attributes) and behavior (methods)." },
        { title: "Module 2: Classes, Objects & Instantiation", content: "# Classes & Blueprint Modeling\nDefine class definitions, instantiate objects on the stack vs heap, and master constructor initialization lists." },
        { title: "Module 3: Encapsulation & Data Hiding", content: "# Access Specifiers & Data Integrity\nProtect internal state using private and protected specifiers, getters, and setters." },
        { title: "Module 4: Constructors, Destructors & Rule of Three/Five", content: "# Resource Management (RAII)\nImplement parameterized constructors, copy constructors, move constructors, and automatic cleanup destructors." },
        { title: "Module 5: Inheritance & Reusability", content: "# Base & Derived Class Hierarchies\nExtend base class features through public, protected, and private inheritance modes." },
        { title: "Module 6: Polymorphism & Virtual Functions", content: "# Dynamic Binding & Vtables\nAchieve runtime polymorphism using virtual functions, pure virtual methods, and vtable pointer mechanics." },
        { title: "Module 7: Abstract Classes & Interfaces", content: "# Pure Abstraction Contracts\nDesign abstract base classes and interface contracts that enforce concrete implementations." },
        { title: "Module 8: Operator Overloading & Friend Classes", content: "# Extending Operator Semantics\nOverload arithmetic, assignment, stream insertion, and comparison operators for custom types." },
        { title: "Module 9: Exception Handling & RAII Guarantees", content: "# Robust Error Recovery\nThrow and catch custom exception hierarchies while preserving Resource Acquisition Is Initialization invariants." },
        { title: "Module 10: Templates & Generic Programming", content: "# Type Independence & Meta-programming\nBuild generic class templates and function templates for type-agnostic utility libraries." },
        { title: "Module 11: SOLID Design Principles", content: "# Architectural Excellence\nMaster Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion." },
        { title: "Module 12: Classic Design Patterns (Factory, Singleton, Observer)", content: "# Gang of Four Patterns\nImplement creational, structural, and behavioral patterns in real-world C++/Java application architectures." },
      ],
    },

    // Course 3: Artificial Intelligence & Machine Learning
    {
      instructorName: "Dr. Alex Chen",
      title: "Artificial Intelligence & Machine Learning",
      description: "Comprehensive guide to neural networks, supervised/unsupervised learning, deep learning, NLP, transformers, and LLM applications.",
      published: true,
      lessons: [
        { title: "Module 1: Introduction to Artificial Intelligence & Intelligent Agents", content: "# Fundamentals of AI\nExplore problem-solving agents, search spaces, heuristic evaluation, and state representation." },
        { title: "Module 2: Mathematics for Machine Learning (Linear Algebra & Calculus)", content: "# Mathematical Foundations\nMaster matrix operations, dot products, eigenvalues, partial derivatives, and gradient vectors." },
        { title: "Module 3: Supervised Learning & Linear Regression", content: "# Regression Analysis\nModel continuous target variables using Ordinary Least Squares, Mean Squared Error, and Gradient Descent." },
        { title: "Module 4: Logistic Regression & Classification Metrics", content: "# Binary & Multiclass Classification\nApply the Sigmoid function, cross-entropy loss, precision, recall, F1 score, and ROC curves." },
        { title: "Module 5: Decision Trees & Ensemble Methods (Random Forest)", content: "# Tree Models & Boosting\nCompute Information Gain, Entropy, Gini Impurity, and combine weak learners into Random Forests." },
        { title: "Module 6: Unsupervised Learning (K-Means & PCA)", content: "# Clustering & Dimensionality Reduction\nGroup unlabelled datasets with K-Means and project high-dimensional data using Principal Component Analysis." },
        { title: "Module 7: Neural Networks & Artificial Perceptrons", content: "# Deep Learning Foundations\nBuild multi-layer perceptrons, forward propagation, activation functions (ReLU, Softmax), and backpropagation." },
        { title: "Module 8: Convolutional Neural Networks (CNNs) for Computer Vision", content: "# Feature Extraction & Vision\nUnderstand convolution filters, pooling layers, feature maps, and image classification architectures." },
        { title: "Module 9: Recurrent Neural Networks (RNNs) & LSTMs", content: "# Sequential Data & Time-Series\nModel text sequences and temporal time-series using gating mechanisms in LSTMs and GRUs." },
        { title: "Module 10: Natural Language Processing (NLP) & Word Embeddings", content: "# Text Tokenization & Vector Spaces\nTransform raw text into vector embeddings using Word2Vec, GloVe, and TF-IDF matrix transformations." },
        { title: "Module 11: Transformer Architecture & Attention Mechanisms", content: "# Self-Attention & Transformers\nUnderstand Positional Encoding, Multi-Head Attention, Encoder-Decoder stacks powering modern AI." },
        { title: "Module 12: Large Language Models (LLMs) & Prompt Engineering", content: "# LLM Orchestration & Fine-Tuning\nMaster Retrieval-Augmented Generation (RAG), prompt engineering techniques, and model alignment." },
      ],
    },

    // Course 4: Modern Web Programming (Full-Stack Next.js & React)
    {
      instructorName: "Muhammad Abdullah",
      title: "Modern Web Programming (Full-Stack Next.js & React)",
      description: "Build production-ready web applications using HTML5, Vanilla CSS, TypeScript, React 19, Next.js App Router, and Supabase PostgreSQL.",
      published: true,
      lessons: [
        { title: "Module 1: Semantic HTML5 Structure & Web Standards", content: "# Semantic Web Markup\nDesign accessible, SEO-optimized page structures using header, nav, main, article, section, and footer elements." },
        { title: "Module 2: Modern CSS Layouts (Flexbox & CSS Grid)", content: "# Responsive CSS Design Systems\nMaster modern Flexbox alignments, CSS Grid multi-column layouts, custom properties (variables), and media queries." },
        { title: "Module 3: JavaScript ES6+ Async Programming & DOM Manipulation", content: "# ES6+ Modern Logic\nUnderstand arrow functions, destructuring, promises, async/await flow, and event listener mechanics." },
        { title: "Module 4: TypeScript Interfaces, Types & Strict Type Safety", content: "# Static Typing in JS\nDefine strict interfaces, generic constraints, union types, and type guards for robust application code." },
        { title: "Module 5: React Functional Components & JSX Syntax", content: "# React Core Fundamentals\nBuild modular UI elements using functional components, props passing, conditional rendering, and key lists." },
        { title: "Module 6: React State Management (useState & useEffect)", content: "# Component Lifecycles & State\nManage local state triggers, side-effect subscriptions, and cleanup functions." },
        { title: "Module 7: Modern CSS Styling Techniques & Glassmorphism Aesthetics", content: "# Premium UI Design Principles\nBuild sleek dark-mode user interfaces using HSL tailored color schemes, subtle backdrops, and glassmorphism." },
        { title: "Module 8: Next.js App Router Architecture & File-Based Routing", content: "# Next.js Routing Systems\nMaster dynamic route parameters `[courseId]`, layout inheritance, loading skeletons, and error boundaries." },
        { title: "Module 9: React Server Components (RSC) vs Client Components", content: "# Server-Driven Rendering\nLeverage zero-bundle-size React Server Components for fast data fetching alongside `'use client'` interactive nodes." },
        { title: "Module 10: Server Actions & Form Mutations", content: "# Zero-API Form Handling\nExecute secure server-side database mutations directly from UI forms using Next.js Server Actions." },
        { title: "Module 11: Database Integration with Prisma ORM & Supabase PostgreSQL", content: "# Relational Cloud Databases\nDefine relational database schemas, execute model queries, handle foreign key cascades, and perform migrations." },
        { title: "Module 12: Web Security, Authentication & Production Deployment", content: "# Full-Stack Deployment\nSecure web apps with Clerk authentication, middleware route protection, headers, and zero-downtime Vercel deployment." },
      ],
    },

    // Course 5: Programming Fundamentals
    {
      instructorName: "David K. Miller",
      title: "Programming Fundamentals",
      description: "Essential introduction to computer programming, algorithmic problem-solving, control flow, functions, memory, and version control.",
      published: true,
      lessons: [
        { title: "Module 1: What is Computer Programming?", content: "# Introduction to Code\nLearn how computers execute instructions, compiled vs interpreted languages, and setup your IDE environment." },
        { title: "Module 2: Variables, Constants & Primitive Data Types", content: "# Storing Data in Memory\nMaster integers, floating-point numbers, booleans, characters, strings, and variable scope." },
        { title: "Module 3: Operators & Mathematical Expressions", content: "# Computation Mechanics\nUnderstand arithmetic, relational, logical, bitwise, and assignment operators in programming." },
        { title: "Module 4: Control Flow: Conditional Branching", content: "# Making Decisions\nImplement if, else if, else conditions, switch statements, and ternary operators to direct code execution." },
        { title: "Module 5: Repetition & Loops (for, while, do-while)", content: "# Iterative Logic\nWrite efficient loops, manage loop counters, avoid infinite loops, and use break and continue statements." },
        { title: "Module 6: Functions & Modular Decomposition", content: "# Reusable Code Blocks\nDefine function signatures, return values, parameters, arguments, pass-by-value vs pass-by-reference." },
        { title: "Module 7: Arrays & Sequential Data Collections", content: "# Index-Based Storage\nStore homogeneous collections of elements in 1D and 2D arrays, matrix transformations, and index bounds." },
        { title: "Module 8: Strings & Text Processing", content: "# Character Sequences\nManipulate string data, concatenation, sub-string extraction, length calculation, and ASCII encoding." },
        { title: "Module 9: Input/Output & File Handling", content: "# Persistent Storage\nRead user input from standard input (stdin) and write persistent records to text files." },
        { title: "Module 10: Debugging & Finding Bugs", content: "# Problem-Solving Skills\nMaster step-over debugging, breakpoints, stack trace reading, and isolating runtime logical errors." },
        { title: "Module 11: Version Control with Git & GitHub", content: "# Code Collaboration\nInitialize Git repositories, create commits, push code branches, and collaborate on GitHub." },
        { title: "Module 12: Building Your First Capstone CLI Application", content: "# Real-World Application\nCombine loops, functions, and file handling into a complete functional command-line software application." },
      ],
    },

    // Course 6: Database Systems & SQL Engineering
    {
      instructorName: "Elena Rostova",
      title: "Database Systems & SQL Engineering",
      description: "Master relational database architecture, ER modeling, SQL queries, B-Tree indexes, transactions, ACID compliance, and NoSQL systems.",
      published: true,
      lessons: [
        { title: "Module 1: Database Architecture & Relational Data Model", content: "# Relational Concepts\nUnderstand tables, rows, attributes, primary keys, foreign keys, and relational algebra." },
        { title: "Module 2: Entity-Relationship (ER) Modeling & Normalization", content: "# Database Design\nDesign ER diagrams and normalize data schemas through First (1NF), Second (2NF), and Third Normal Form (3NF)." },
        { title: "Module 3: SQL DDL & DML Fundamentals", content: "# SQL Basics\nMaster Data Definition Language (CREATE, ALTER, DROP) and Data Manipulation Language (SELECT, INSERT, UPDATE, DELETE)." },
        { title: "Module 4: Advanced SQL Joins & Subqueries", content: "# Querying Relations\nPerform INNER, LEFT, RIGHT, FULL OUTER joins, self-joins, and nested subqueries." },
        { title: "Module 5: Aggregations, Grouping & Window Functions", content: "# Analytics Queries\nUse COUNT, SUM, AVG, GROUP BY, HAVING, and windowing functions like ROW_NUMBER() and RANK()." },
        { title: "Module 6: Database Transactions & ACID Properties", content: "# Transaction Processing\nUnderstand Atomicity, Consistency, Isolation, and Durability using COMMIT, ROLLBACK, and savepoints." },
        { title: "Module 7: Indexing Strategies & B-Trees", content: "# Query Performance\nLearn primary, secondary, composite, and B-Tree indexes to accelerate lookups." },
        { title: "Module 8: Stored Procedures, Functions & Triggers", content: "# Server-Side Logic\nWrite PL/SQL stored procedures, user-defined functions, and automated database triggers." },
        { title: "Module 9: Query Optimization & Execution Plans", content: "# Performance Tuning\nAnalyze EXPLAIN execution plans, join order selection, and index scanning techniques." },
        { title: "Module 10: NoSQL Databases & Document Stores (MongoDB)", content: "# Non-Relational Paradigm\nExplore JSON document databases, dynamic schemas, indexing, and MongoDB aggregation pipelines." },
        { title: "Module 11: Distributed Databases & Sharding", content: "# Horizontal Scaling\nUnderstand database replication, read-replicas, partitioning, sharding, and the CAP theorem." },
        { title: "Module 12: Database Security & Role-Based Access Control", content: "# Securing Data\nManage database users, roles, GRANT/REVOKE privileges, encryption at rest, and SQL injection prevention." },
      ],
    },

    // Course 7: Operating Systems & System Architecture
    {
      instructorName: "Prof. Marcus Vance",
      title: "Operating Systems & System Architecture",
      description: "Deep dive into OS kernel internals, process management, CPU scheduling, concurrency, virtual memory, file systems, and system calls.",
      published: true,
      lessons: [
        { title: "Module 1: Introduction to Operating System Kernels & System Calls", content: "# Kernel Architecture\nExplore kernel modes, user space transitions, interrupts, traps, and system call interfaces." },
        { title: "Module 2: Process Management & Process Control Blocks (PCB)", content: "# Process Lifecycle\nUnderstand process states, context switching, Process Control Blocks, and fork/exec creation." },
        { title: "Module 3: Threads & Multithreading Models", content: "# Thread Concurrency\nCompare user threads vs kernel threads, POSIX pthreads, and thread synchronization." },
        { title: "Module 4: CPU Scheduling Algorithms", content: "# Processor Allocation\nAnalyze First-Come First-Served, Shortest Job First, Round Robin, and Multi-Level Feedback Queue scheduling." },
        { title: "Module 5: Process Synchronization & Mutex Mutexes", content: "# Race Conditions\nSolve critical section problems using mutex locks, semaphores, monitors, and atomic instructions." },
        { title: "Module 6: Deadlocks & Banker's Algorithm", content: "# Deadlock Prevention\nIdentify Coffman conditions for deadlocks, avoidance via Banker's algorithm, and recovery strategies." },
        { title: "Module 7: Physical Memory Management & Paging", content: "# Memory Allocation\nMaster contiguous memory allocation, segmentation, paging, page tables, and Translation Lookaside Buffers (TLB)." },
        { title: "Module 8: Virtual Memory & Page Replacement Algorithms", content: "# Virtual Memory\nImplement demand paging, thrashing prevention, and page replacement algorithms (FIFO, LRU, Optimal)." },
        { title: "Module 9: File System Architecture & Inodes", content: "# File Systems\nUnderstand directory structures, inode file metadata, block allocation (contiguous, linked, indexed), and journaling." },
        { title: "Module 10: I/O Hardware Management & Disk Scheduling", content: "# Disk Operations\nLearn DMA transfers, interrupt handlers, and disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN)." },
        { title: "Module 11: Virtualization & Containerization Internals", content: "# System Isolation\nCompare Hypervisors (Type 1 vs Type 2) with Linux cgroups and namespaces powering Docker containers." },
        { title: "Module 12: OS Security, Permissions & Kernel Protections", content: "# System Hardening\nMaster access control lists, SELinux policies, buffer overflow protections (ASLR, DEP), and rootkit defense." },
      ],
    },

    // Course 8: Computer Networks & Distributed Systems
    {
      instructorName: "David K. Miller",
      title: "Computer Networks & Distributed Systems",
      description: "Explore TCP/IP networking stack, IP routing, socket programming, HTTP/HTTPS protocols, network security, and cloud architectures.",
      published: true,
      lessons: [
        { title: "Module 1: Network Layer Models: OSI vs TCP/IP Stack", content: "# Network Fundamentals\nCompare 7-layer OSI model vs 4-layer TCP/IP stack, packet encapsulation, and protocols at each layer." },
        { title: "Module 2: Physical & Data Link Layers (Ethernet & MAC)", content: "# Local Framing\nLearn framing, CSMA/CD, MAC addressing, Ethernet switches, and VLAN configuration." },
        { title: "Module 3: Network Layer: IPv4, IPv6 & Subnetting", content: "# IP Addressing\nMaster Classless Inter-Domain Routing (CIDR), IPv4/IPv6 headers, subnet masks, and NAT translation." },
        { title: "Module 4: Routing Protocols (OSPF & BGP)", content: "# Packet Routing\nCompare Interior Gateway Protocols (RIP, OSPF) vs Exterior Gateway Protocols (BGP) for global internet routing." },
        { title: "Module 5: Transport Layer: TCP vs UDP Protocols", content: "# Reliable Transport\nAnalyze 3-way handshakes, TCP flow control (Sliding Window), congestion control, and UDP datagrams." },
        { title: "Module 6: Socket Programming in C/Python", content: "# Network Sockets\nBuild client-server network applications using POSIX TCP and UDP socket API functions." },
        { title: "Module 7: Application Layer: HTTP/1.1, HTTP/2, HTTP/3 & DNS", content: "# Web Protocols\nExplore DNS resolution, HTTP request methods, headers, keep-alive connections, and QUIC/HTTP3." },
        { title: "Module 8: Network Security & Cryptographic Protocols (TLS/SSL)", content: "# Securing Traffic\nMaster symmetric encryption, RSA asymmetric key exchange, TLS handshakes, and digital certificates." },
        { title: "Module 9: Firewalls, VPNs & Intrusion Detection Systems", content: "# Perimeter Defense\nConfigure packet filtering firewalls, IPsec/OpenVPN tunnels, and IDS/IPS signature detection." },
        { title: "Module 10: Distributed Systems Architecture & Consensus", content: "# Distributed Coordination\nLearn distributed system challenges, RPCs, Paxos, and Raft consensus algorithms." },
        { title: "Module 11: Content Delivery Networks (CDNs) & Load Balancing", content: "# High Availability\nImplement DNS load balancing, reverse proxies (Nginx), and edge caching CDNs." },
        { title: "Module 12: Cloud Infrastructure & Microservices Communication", content: "# Modern Cloud Architecture\nMaster cloud service models (IaaS, PaaS, SaaS), REST APIs, gRPC, and event-driven message queues (Kafka)." },
      ],
    },

    // Course 9: Software Engineering & Agile Methodologies
    {
      instructorName: "Muhammad Abdullah",
      title: "Software Engineering & Agile Methodologies",
      description: "Master modern software development lifecycles, Agile Scrum, microservices design, TDD testing, CI/CD pipelines, and software quality.",
      published: true,
      lessons: [
        { title: "Module 1: Software Development Life Cycle (SDLC) Models", content: "# SDLC Paradigms\nCompare traditional Waterfall, Spiral, Iterative, and Agile development methodologies." },
        { title: "Module 2: Requirements Engineering & User Stories", content: "# Defining Requirements\nWrite clear functional/non-functional requirements, user stories, acceptance criteria, and estimation story points." },
        { title: "Module 3: Agile Frameworks: Scrum & Kanban", content: "# Agile Execution\nMaster Scrum roles (Product Owner, Scrum Master, Team), sprint planning, daily standups, and retrospectives." },
        { title: "Module 4: Software Architecture & Microservices Design", content: "# System Design\nDesign monolithic vs microservice architectures, domain-driven design, and API gateway patterns." },
        { title: "Module 5: Clean Code & Code Refactoring Techniques", content: "# Code Maintainability\nApply clean coding principles, eliminate code smells, extract methods, and refactor legacy code bases." },
        { title: "Module 6: Unit Testing & Test-Driven Development (TDD)", content: "# Automated Testing\nMaster the Red-Green-Refactor TDD cycle, mock objects, stubs, and unit test coverage frameworks." },
        { title: "Module 7: Integration & End-to-End (E2E) Testing", content: "# Comprehensive QA\nBuild integration tests for database layers, REST APIs, and automated E2E browser tests using Playwright." },
        { title: "Module 8: Continuous Integration & Continuous Deployment (CI/CD)", content: "# DevOps Automation\nCreate automated GitHub Actions CI/CD workflows for building, testing, linting, and deploying code." },
        { title: "Module 9: Software Quality Assurance (SQA) & Static Analysis", content: "# Static Code Inspection\nIncorporate static code analyzers, linters, security vulnerability scanners, and code complexity metrics." },
        { title: "Module 10: Version Control Workflows (Git Flow & Trunk-Based)", content: "# Git Team Workflows\nCompare Git Flow branching strategies vs Trunk-Based Development with feature flags." },
        { title: "Module 11: Peer Code Reviews & Architectural Governance", content: "# Team Collaboration\nConduct constructive pull request code reviews, enforce style guides, and maintain technical documentation." },
        { title: "Module 12: Capstone Software Project Management", content: "# Capstone Delivery\nPlan, track, mitigate technical debt, and ship a production-grade software project successfully." },
      ],
    },

    // Course 10: Cybersecurity & Ethical Hacking
    {
      instructorName: "David K. Miller",
      title: "Cybersecurity & Ethical Hacking",
      description: "Learn penetration testing, ethical hacking, OWASP Top 10 vulnerabilities, cryptography, malware analysis, and network defense.",
      published: true,
      lessons: [
        { title: "Module 1: Fundamentals of Information Security & CIA Triad", content: "# InfoSec Foundations\nMaster Confidentiality, Integrity, Availability, threat modeling, attack surfaces, and risk management." },
        { title: "Module 2: Cryptography & Public Key Infrastructure (PKI)", content: "# Encryption Mechanics\nImplement AES block ciphers, RSA asymmetric key pairs, SHA-256 hashing, and digital signatures." },
        { title: "Module 3: Network Reconnaissance & Vulnerability Scanning", content: "# Ethical Recon\nConduct passive/active reconnaissance using Nmap port scans, Wireshark packet captures, and Nessus scans." },
        { title: "Module 4: Web Security & OWASP Top 10 Vulnerabilities", content: "# Web Exploits\nAnalyze Broken Access Control, Injection, Cryptographic Failures, Insecure Design, and SSRF." },
        { title: "Module 5: SQL Injection (SQLi) & Cross-Site Scripting (XSS)", content: "# Exploitation Mechanics\nExecute in-band/blind SQL injection attacks and Stored, Reflected, DOM-based XSS exploits." },
        { title: "Module 6: Authentication Security, Session Hijacking & OAuth", content: "# Auth Security\nSecure session tokens, mitigate CSRF attacks, enforce MFA, and audit OAuth 2.0 implementation flows." },
        { title: "Module 7: Reverse Engineering & Malware Analysis", content: "# Static & Dynamic Analysis\nAnalyze disassemblers (Ghidra, IDA Pro), sandbox execution, and C2 communication channels." },
        { title: "Module 8: Penetration Testing Methodologies & Metasploit", content: "# Pen Testing Execution\nFollow PTES guidelines to weaponize exploits, escalate privileges, and maintain persistence." },
        { title: "Module 9: Wireless & Mobile Application Security", content: "# Wireless Security\nAudit WPA2/WPA3 enterprise encryption, APK decompilation, dynamic instrumentation (Frida), and iOS security." },
        { title: "Module 10: Cloud Security & Identity Access Management (IAM)", content: "# Securing Cloud\nEnforce least privilege IAM policies, secure S3 storage buckets, and audit cloud infrastructure configurations." },
        { title: "Module 11: Digital Forensics & Incident Response (DFIR)", content: "# Forensics Analysis\nAnalyze memory dumps, file system artifacts, log analysis, and incident containment strategies." },
        { title: "Module 12: Ethical Hacking Compliance & Governance", content: "# Legal & Governance\nUnderstand cybersecurity laws, GDPR compliance, SOC2 certification, and ethical disclosure standards." },
      ],
    },

    // Course 11: Computer Architecture & Assembly Language
    {
      instructorName: "Prof. Marcus Vance",
      title: "Computer Architecture & Assembly Language",
      description: "Explore digital logic gates, CPU microarchitecture, x86/ARM assembly programming, memory hierarchies, pipelining, and RISC-V.",
      published: true,
      lessons: [
        { title: "Module 1: Digital Logic Gates & Boolean Algebra", content: "# Digital Foundations\nMaster AND, OR, NOT, NAND, NOR, XOR gates, Boolean simplification, and Karnaugh maps." },
        { title: "Module 2: Combinational & Sequential Circuits", content: "# Hardware Design\nBuild adders, multiplexers, decoders, SR flip-flops, D flip-flops, and hardware registers." },
        { title: "Module 3: Register Transfer Level (RTL) & ALU Design", content: "# Arithmetic Logic Unit\nDesign Arithmetic Logic Units (ALU), control units, data buses, and clock cycle timings." },
        { title: "Module 4: x86/x64 Assembly Language Fundamentals", content: "# Assembly Basics\nWrite x86 assembly using registers (EAX, EBX, ECX), MOV, ADD, SUB instructions, and memory addressing modes." },
        { title: "Module 5: Control Flow & Function Call Stacks in Assembly", content: "# Assembly Control Flow\nImplement conditional jumps (CMP, JMP, JE), stack frame allocation (PUSH, POP, CALL, RET)." },
        { title: "Module 6: Memory Hierarchy & Cache Microarchitecture", content: "# CPU Caching\nUnderstand L1, L2, L3 cache organization, direct-mapped vs fully associative caches, and cache miss rates." },
        { title: "Module 7: Instruction Pipelining & Pipelining Hazards", content: "# CPU Execution Speedup\nMaster 5-stage CPU pipelines (IF, ID, EX, MEM, WB), structural hazards, data hazards, and control hazards." },
        { title: "Module 8: Instruction-Level Parallelism (ILP) & Superscalar Processing", content: "# Parallel Hardware\nExplore out-of-order execution, branch prediction units, and superscalar instruction dispatch." },
        { title: "Module 9: Bus Interconnects & Memory-Mapped I/O", content: "# Peripheral Interfacing\nLearn PCI Express bus protocols, DMA controllers, and memory-mapped I/O communication." },
        { title: "Module 10: Multi-Core Processors & Cache Coherence", content: "# Multi-Core Design\nUnderstand symmetric multiprocessing (SMP), MESI cache coherence protocols, and memory barriers." },
        { title: "Module 11: Hardware Security & Speculative Execution Vulnerabilities", content: "# Hardware Vulnerabilities\nAnalyze speculative execution side-channel attacks including Spectre, Meltdown, and Rowhammer." },
        { title: "Module 12: RISC-V Open Instruction Set Architecture (ISA)", content: "# Open Hardware\nProgram in RISC-V assembly, modular ISA extensions (RV32I, RV64I), and custom hardware accelerators." },
      ],
    },

    // Course 12: Theory of Computation & Automata
    {
      instructorName: "Dr. Sarah Jenkins",
      title: "Theory of Computation & Automata",
      description: "Master formal languages, deterministic/non-deterministic finite automata, context-free grammars, Turing machines, P vs NP, and decidability.",
      published: true,
      lessons: [
        { title: "Module 1: Fundamentals of Set Theory & Formal Languages", content: "# Mathematical Prerequisites\nUnderstand alphabets, strings, formal languages, set operations, and proof techniques (induction, contradiction)." },
        { title: "Module 2: Deterministic Finite Automata (DFA)", content: "# DFA Mechanics\nDesign 5-tuple DFAs (Q, Σ, δ, q0, F), state transition tables, state diagrams, and language recognition." },
        { title: "Module 3: Non-Deterministic Finite Automata (NFA) & NFA-to-DFA Conversion", content: "# NFA & Equivalence\nUnderstand non-deterministic transitions, ε-transitions, and the Subset Construction algorithm." },
        { title: "Module 4: Regular Expressions & State Minimization", content: "# Regular Languages\nBuild regular expressions, convert regex to finite automata (Thompson's algorithm), and minimize DFA states." },
        { title: "Module 5: The Pumping Lemma for Regular Languages", content: "# Proving Non-Regularity\nApply the Pumping Lemma to prove non-regularity of languages using adversary game techniques." },
        { title: "Module 6: Context-Free Grammars (CFG) & Derivation Trees", content: "# Context-Free Languages\nDefine CFG productions, parse trees, ambiguity in grammars, and Chomsky Normal Form (CNF)." },
        { title: "Module 7: Pushdown Automata (PDA) & Stack Memory", content: "# Stack Automata\nDesign non-deterministic Pushdown Automata and prove equivalence with Context-Free Grammars." },
        { title: "Module 8: The Pumping Lemma for Context-Free Languages", content: "# Proving Non-CFLs\nApply the CFL Pumping Lemma to establish limitations of Pushdown Automata." },
        { title: "Module 9: Turing Machines & Universal Computation", content: "# Universal Machines\nDefine standard Turing Machines (infinite tape, head, transitions) and Universal Turing Machines." },
        { title: "Module 10: Church-Turing Thesis & Decidability", content: "# Computational Limits\nExplore computable functions, decidable languages, recognizable languages, and halting problems." },
        { title: "Module 11: Complexity Theory: Time & Space Classes (P, NP, NP-Complete)", content: "# Complexity Classes\nDefine deterministic P time vs non-deterministic NP time, verification algorithms, and polynomial reductions." },
        { title: "Module 12: NP-Completeness Proofs & Cook-Levin Theorem", content: "# Famous Unsolved Problems\nProve 3-SAT, Clique, Vertex Cover, and Traveling Salesperson Problem NP-completeness." },
      ],
    },
  ];

  for (const cData of coursesData) {
    const assignedInstructorId = instructorMap[cData.instructorName] || instructorMap["Muhammad Abdullah"];

    // Find existing course or create new
    let course = await prisma.course.findFirst({
      where: { title: cData.title },
    });

    if (course) {
      course = await prisma.course.update({
        where: { id: course.id },
        data: {
          instructorId: assignedInstructorId,
          description: cData.description,
          published: cData.published,
        },
      });
    } else {
      course = await prisma.course.create({
        data: {
          instructorId: assignedInstructorId,
          title: cData.title,
          description: cData.description,
          published: cData.published,
        },
      });
    }

    console.log(`\n📚 Course: ${course.title} (Instructor: ${cData.instructorName})`);
  }

  console.log("\n🎉 All 6 Faculty Members & Login Email Variants successfully seeded into Supabase!");
}

seedFullCoursesWithFaculty()
  .catch((e) => {
    console.error("❌ Error seeding faculty & courses:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
