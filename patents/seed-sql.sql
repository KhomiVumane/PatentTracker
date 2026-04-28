USE trackip;

-- ─── SAMPLE PATENTS ───────────────────────────────────────────────────────────
INSERT INTO patents (patent_number, title, owner, filing_date, status, category, abstract, keywords) VALUES
('US10123456B2', 'Advanced Solar Energy Storage System with Adaptive Load Balancing', 'Tesla Inc', '2021-03-15', 'Active', 'Utility',
 'A system and method for storing solar energy using adaptive load balancing algorithms. The invention includes novel battery management techniques that increase charge efficiency by up to 40% compared to prior art.',
 'solar energy, battery storage, load balancing, photovoltaic'),

('US10234567B2', 'Machine Learning Inference Acceleration on Edge Devices', 'Apple Inc', '2022-07-20', 'Active', 'Utility',
 'An apparatus and method for accelerating machine learning inference computations on edge devices with constrained power budgets. Includes a novel neural processing unit architecture operating below 5W.',
 'machine learning, inference, edge computing, neural processing unit, NPU'),

('US10345678B2', 'mRNA Lipid Nanoparticle Delivery System for Targeted Organ Therapy', 'Pfizer Inc', '2020-11-05', 'Active', 'Utility',
 'A lipid nanoparticle (LNP) formulation for delivering mRNA therapeutics to specific organs beyond liver-first clearance, enabling targeted gene expression in lung, spleen, and muscle tissue.',
 'mRNA, lipid nanoparticle, drug delivery, gene therapy, LNP'),

('US10456789A1', 'Solid-State Electrolyte Composition for Lithium-Ion Batteries', 'Samsung Electronics', '2023-01-10', 'Pending', 'Utility',
 'A solid-state ceramic electrolyte exhibiting ionic conductivity at room temperature for use in next-generation lithium-ion batteries. Provides improved safety and energy density over liquid electrolyte systems.',
 'solid state battery, electrolyte, lithium ion, ceramic, ionic conductivity'),

('US10567890B2', 'Quantum Error Correction Using Surface Code Architectures', 'IBM Corp', '2022-09-30', 'Active', 'Utility',
 'A method and system for implementing quantum error correction using planar surface codes on superconducting qubit arrays. Achieves fault-tolerant logical qubit operation with sub-threshold physical error rates.',
 'quantum computing, error correction, surface code, qubit, fault tolerant'),

('US10678901B2', 'Autonomous Vehicle Lane Detection Using Multi-Spectral Imaging', 'Toyota Motor Corp', '2021-06-22', 'Active', 'Utility',
 'A lane detection system for autonomous vehicles utilizing multi-spectral imaging sensors combined with deep convolutional neural networks for reliable detection in adverse weather conditions.',
 'autonomous vehicle, lane detection, computer vision, multi-spectral, deep learning'),

('US10789012A1', 'Low-Power Neuromorphic Chip Architecture for AI Workloads', 'Intel Corp', '2023-03-14', 'Pending', 'Utility',
 'A neuromorphic processor architecture that mimics biological neural networks to achieve ultra-low power AI computation. Suitable for always-on IoT inference at sub-milliwatt power levels.',
 'neuromorphic, chip, AI, low power, IoT, inference'),

('US10890123B2', 'Distributed Ledger System for Supply Chain Provenance Tracking', 'IBM Corp', '2020-08-18', 'Active', 'Utility',
 'A blockchain-based distributed ledger system for tracking product provenance across complex supply chains. Enables tamper-proof recording of custody transfers and environmental conditions.',
 'blockchain, supply chain, distributed ledger, provenance, IoT'),

('US10901234B2', 'Climate-Adaptive HVAC Control Using Predictive AI Algorithms', 'General Electric', '2021-12-01', 'Active', 'Utility',
 'An HVAC control system leveraging predictive AI to optimize energy consumption based on weather forecasts, occupancy patterns, and real-time utility pricing signals.',
 'HVAC, climate control, AI, energy efficiency, predictive'),

('US11012345A1', 'High-Efficiency Wind Turbine Blade with Biomimetic Surface Texture', '3M Co', '2023-05-07', 'Pending', 'Utility',
 'A wind turbine blade design incorporating biomimetic surface textures inspired by shark skin and owl feathers to reduce aerodynamic drag and increase energy capture at low wind speeds.',
 'wind turbine, renewable energy, biomimetic, aerodynamics, blade design');

-- ─── SAMPLE TRADEMARKS ────────────────────────────────────────────────────────
INSERT INTO trademarks (trademark_number, name, owner, filing_date, status, goods_services) VALUES
('TM8001234', 'ULTRACHARGE™', 'Tesla Inc', '2022-04-10', 'Active',
 'Electric vehicle charging equipment; battery energy storage systems; software for managing energy distribution'),

('TM8002345', 'NEURALINK PRO™', 'Neuralink Corp', '2023-02-28', 'Pending',
 'Medical devices; neural interface implants; software for brain-computer interaction'),

('TM8003456', 'SWIFTINFER™', 'Qualcomm Inc', '2022-11-15', 'Active',
 'Semiconductor chips; integrated circuits; AI inference processors for mobile devices'),

('TM8004567', 'CLIMATESENSE™', 'Siemens AG', '2021-07-20', 'Active',
 'Environmental monitoring equipment; climate control software; IoT sensors for building management'),

('TM8005678', 'QUANTUMVAULT™', 'Microsoft Corp', '2023-06-01', 'Pending',
 'Quantum computing services; cryptographic software; cloud-based quantum key distribution');

-- ─── DEMO USER (password: demo1234) ──────────────────────────────────────────
INSERT INTO users (email, password_hash, display_name) VALUES
('demo@trackip.io', '$2b$10$examplehashedpasswordfordemopurposesonly', 'Demo User');

-- ─── FILING TRENDS DATA ───────────────────────────────────────────────────────
INSERT INTO filing_trends (category, year, month, patent_count, tm_count) VALUES
('AI / Machine Learning',    2024, 11, 890,  340),
('AI / Machine Learning',    2024, 12, 940,  380),
('AI / Machine Learning',    2025, 1,  1020, 410),
('AI / Machine Learning',    2025, 2,  1150, 430),
('AI / Machine Learning',    2025, 3,  1280, 460),
('AI / Machine Learning',    2025, 4,  1420, 510),

('Battery Technology',       2024, 11, 520,  90),
('Battery Technology',       2024, 12, 548,  95),
('Battery Technology',       2025, 1,  590,  100),
('Battery Technology',       2025, 2,  612,  108),
('Battery Technology',       2025, 3,  670,  115),
('Battery Technology',       2025, 4,  742,  130),

('mRNA / Biotech',           2024, 11, 310,  60),
('mRNA / Biotech',           2024, 12, 340,  68),
('mRNA / Biotech',           2025, 1,  395,  72),
('mRNA / Biotech',           2025, 2,  410,  80),
('mRNA / Biotech',           2025, 3,  460,  88),
('mRNA / Biotech',           2025, 4,  512,  95),

('Quantum Computing',        2024, 11, 85,   20),
('Quantum Computing',        2024, 12, 92,   22),
('Quantum Computing',        2025, 1,  105,  25),
('Quantum Computing',        2025, 2,  118,  28),
('Quantum Computing',        2025, 3,  140,  34),
('Quantum Computing',        2025, 4,  168,  40),

('Semiconductor / Chips',    2024, 11, 780,  180),
('Semiconductor / Chips',    2024, 12, 820,  190),
('Semiconductor / Chips',    2025, 1,  850,  195),
('Semiconductor / Chips',    2025, 2,  890,  200),
('Semiconductor / Chips',    2025, 3,  920,  210),
('Semiconductor / Chips',    2025, 4,  980,  225),

('Climate / Clean Energy',   2024, 11, 290,  75),
('Climate / Clean Energy',   2024, 12, 310,  80),
('Climate / Clean Energy',   2025, 1,  340,  88),
('Climate / Clean Energy',   2025, 2,  370,  95),
('Climate / Clean Energy',   2025, 3,  400,  105),
('Climate / Clean Energy',   2025, 4,  445,  118);
