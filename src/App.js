import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyles = {
  start: {
    padding: '12px 16px',
    border: '2px solid #10b981',
    borderRadius: 12,
    background: '#ecfdf5',
    color: '#065f46',
    fontWeight: 'bold',
    minWidth: 120,
    textAlign: 'center',
  },
  decision: {
    padding: '10px 14px',
    border: '2px solid #3b82f6',
    borderRadius: 8,
    background: '#eff6ff',
    color: '#1e40af',
    minWidth: 140,
    textAlign: 'center',
  },
  process: {
    padding: '10px 14px',
    border: '2px solid #f59e0b',
    borderRadius: 8,
    background: '#fef3c7',
    color: '#92400e',
    minWidth: 120,
    textAlign: 'center',
  },
  end: {
    padding: '10px 14px',
    border: '2px solid #dc2626',
    borderRadius: 8,
    background: '#fef2f2',
    color: '#991b1b',
    minWidth: 140,
    textAlign: 'center',
  },
};

const nodeDetails = {
  'bac': {
    title: 'Baccalauréat Science Maths A',
    description: 'The Moroccan scientific baccalaureate with mathematics specialization. This is your starting point for pursuing engineering and computer science careers.',
    duration: '3 years (Lycée)',
    requirements: 'Complete secondary education with focus on mathematics and sciences',
    nextSteps: 'Opens doors to CPGE, universities, and various educational paths',
    pros: ['Strong mathematical foundation', 'Multiple pathway options', 'Recognized nationally'],
    cons: ['Competitive', 'Heavy workload', 'Limited practical experience']
  },
  'cpge': {
    title: 'Classes Préparatoires aux Grandes Écoles',
    description: 'Intensive 2-year preparatory program for engineering schools. MPSI (Math-Physics-Engineering) in first year, MP (Math-Physics) in second year.',
    duration: '2 years',
    requirements: 'Excellent Bac Science Maths grades (typically 16+/20)',
    nextSteps: 'CNC competitive exams for top engineering schools',
    pros: ['Rigorous training', 'Access to top schools', 'Strong theoretical foundation'],
    cons: ['Very demanding', 'High stress', 'Limited practical skills']
  },
  'uni_public': {
    title: 'Public University (Licence)',
    description: 'Bachelor\'s degree at Moroccan public universities. More accessible and affordable option with decent quality education.',
    duration: '3 years + 2 years Master',
    requirements: 'Bac Science Maths (moderate grades acceptable)',
    nextSteps: 'Master\'s degree or direct job market entry',
    pros: ['Affordable', 'Less competitive', 'Flexible schedule'],
    cons: ['Limited resources', 'Outdated curriculum', 'Language barriers']
  },
  'private_school': {
    title: 'Private Engineering/IT Schools',
    description: 'Private institutions offering engineering and IT programs. Often have better resources and industry connections.',
    duration: '3-5 years',
    requirements: 'Bac Science Maths + entrance exam + financial capacity',
    nextSteps: 'Direct entry to job market with good prospects',
    pros: ['Modern curriculum', 'Industry partnerships', 'Better facilities'],
    cons: ['Expensive', 'Variable quality', 'Less prestigious than public schools']
  },
  'abroad': {
    title: 'Study Abroad',
    description: 'Pursuing higher education in foreign countries. Offers international exposure and often better career prospects.',
    duration: '3-4 years Bachelor + optional Master',
    requirements: 'Good grades + language proficiency + financial means',
    nextSteps: 'International career opportunities or return to Morocco',
    pros: ['International exposure', 'Better job prospects', 'Quality education'],
    cons: ['Very expensive', 'Cultural adaptation', 'Visa complexities']
  },
  'bootcamp': {
    title: 'Coding Bootcamps (1337, ALX)',
    description: 'Intensive practical coding programs. 1337 (42 Network) and ALX offer tuition-free, project-based learning.',
    duration: '1-2 years intensive',
    requirements: 'Motivation and problem-solving skills (no degree required)',
    nextSteps: 'Direct entry to tech jobs',
    pros: ['Practical skills', 'Job-ready', 'Free tuition', 'Industry relevant'],
    cons: ['No formal degree', 'Very intensive', 'Limited theory']
  },
  'online': {
    title: 'Online Degrees',
    description: 'Bachelor\'s degrees from international universities delivered online. Includes MOOCs, MicroMasters, and full degree programs.',
    duration: '3-4 years part-time',
    requirements: 'Self-discipline + internet access + English proficiency',
    nextSteps: 'Job market or further online education',
    pros: ['Flexible schedule', 'International recognition', 'Cost-effective'],
    cons: ['Self-discipline required', 'Limited networking', 'Credibility concerns']
  },
  'self_taught': {
    title: 'Self-Taught Path',
    description: 'Learning programming and IT skills independently through online resources, building projects and earning certifications.',
    duration: '1-3 years continuous learning',
    requirements: 'Strong self-motivation and discipline',
    nextSteps: 'Portfolio-based job applications',
    pros: ['Complete flexibility', 'Cost-effective', 'Learn at own pace'],
    cons: ['No formal credentials', 'Requires discipline', 'Hard to get first job']
  },
  'cnc': {
    title: 'CNC National Competition',
    description: 'National competitive exam (Concours National Commun) for entry into Morocco\'s top engineering schools after CPGE.',
    duration: 'Annual exam period',
    requirements: 'CPGE completion with good grades',
    nextSteps: 'Admission to top engineering schools based on ranking',
    pros: ['Merit-based selection', 'Access to best schools', 'Scholarship opportunities'],
    cons: ['Extremely competitive', 'High pressure', 'Limited spots']
  },
  'morocco_eng': {
    title: 'Top Engineering Schools in Morocco',
    description: 'Prestigious institutions like ENSAM, EMI, INSA, etc. Produce Morocco\'s engineering elite.',
    duration: '3 years engineering cycle',
    requirements: 'Success in CNC competition',
    nextSteps: 'High-level engineering careers in Morocco and internationally',
    pros: ['Excellent reputation', 'Strong alumni network', 'Job guarantee'],
    cons: ['Very selective', 'Traditional approach', 'Limited entrepreneurship focus']
  },
};

const flowchart_data = {
  nodes: [
    { id: 'bac', label: 'Bac Science Maths A', type: 'start' },
    { id: 'cpge', label: 'CPGE MPSI/MP', type: 'decision' },
    { id: 'uni_public', label: 'Public University (Licence)', type: 'decision' },
    { id: 'private_school', label: 'Private Engineering/IT School', type: 'decision' },
    { id: 'abroad', label: 'Study Abroad', type: 'decision' },
    { id: 'bootcamp', label: 'Bootcamp (e.g. 1337, ALX)', type: 'decision' },
    { id: 'online', label: 'Online Degrees', type: 'decision' },
    { id: 'self_taught', label: 'Self-Taught + Certifications', type: 'decision' },
    { id: 'cnc', label: 'CNC Exams', type: 'process' },
    { id: 'morocco_eng', label: 'Top Engineering Schools in Morocco', type: 'end' },
    { id: 'licence', label: 'Licence en Informatique', type: 'process' },
    { id: 'master', label: 'Master en Informatique', type: 'end' },
    { id: 'private_eng', label: 'Bachelor/Engineer Degree (Private)', type: 'end' },
    { id: 'france', label: 'France (CPGE or Licence)', type: 'process' },
    { id: 'canada', label: 'Canada (Bachelor CS)', type: 'process' },
    { id: 'usa', label: 'USA (Bachelor CS)', type: 'process' },
    { id: 'germany', label: 'Germany (Bachelor CS)', type: 'process' },
    { id: 'uk', label: 'UK (Bachelor CS)', type: 'process' },
    { id: 'abroad_degree', label: 'International CS Degree', type: 'end' },
    { id: 'bootcamp_cert', label: 'Job-Ready Certificate + Portfolio', type: 'end' },
    { id: 'online_bsc', label: 'Online BSc CS / MicroMasters', type: 'end' },
    { id: 'certs_portfolio', label: 'Certifications + GitHub Portfolio', type: 'end' },
  ],
  edges: [
    { from: 'bac', to: 'cpge' },
    { from: 'bac', to: 'uni_public' },
    { from: 'bac', to: 'private_school' },
    { from: 'bac', to: 'abroad' },
    { from: 'bac', to: 'bootcamp' },
    { from: 'bac', to: 'online' },
    { from: 'bac', to: 'self_taught' },
    { from: 'cpge', to: 'cnc' },
    { from: 'cnc', to: 'morocco_eng' },
    { from: 'uni_public', to: 'licence' },
    { from: 'licence', to: 'master' },
    { from: 'private_school', to: 'private_eng' },
    { from: 'abroad', to: 'france' },
    { from: 'abroad', to: 'canada' },
    { from: 'abroad', to: 'usa' },
    { from: 'abroad', to: 'germany' },
    { from: 'abroad', to: 'uk' },
    { from: 'france', to: 'abroad_degree' },
    { from: 'canada', to: 'abroad_degree' },
    { from: 'usa', to: 'abroad_degree' },
    { from: 'germany', to: 'abroad_degree' },
    { from: 'uk', to: 'abroad_degree' },
    { from: 'bootcamp', to: 'bootcamp_cert' },
    { from: 'online', to: 'online_bsc' },
    { from: 'self_taught', to: 'certs_portfolio' },
  ],
};

const generateHorizontalFlowElements = (data) => {
  // Define horizontal positions for each column (level)
  const positions = {
    // Level 1: Starting point
    'bac': { x: 50, y: 400 },
    
    // Level 2: Main decision points
    'cpge': { x: 300, y: 100 },
    'uni_public': { x: 300, y: 200 },
    'private_school': { x: 300, y: 300 },
    'abroad': { x: 300, y: 450 },
    'bootcamp': { x: 300, y: 600 },
    'online': { x: 300, y: 700 },
    'self_taught': { x: 300, y: 800 },
    
    // Level 3: Intermediate processes
    'cnc': { x: 550, y: 100 },
    'licence': { x: 550, y: 200 },
    'france': { x: 550, y: 350 },
    'canada': { x: 550, y: 400 },
    'usa': { x: 550, y: 450 },
    'germany': { x: 550, y: 500 },
    'uk': { x: 550, y: 550 },
    
    // Level 4: Final outcomes
    'morocco_eng': { x: 800, y: 100 },
    'master': { x: 800, y: 200 },
    'private_eng': { x: 800, y: 300 },
    'abroad_degree': { x: 800, y: 450 },
    'bootcamp_cert': { x: 800, y: 600 },
    'online_bsc': { x: 800, y: 700 },
    'certs_portfolio': { x: 800, y: 800 },
  };

  const nodes = data.nodes.map((node) => ({
    id: node.id,
    data: { label: node.label },
    position: positions[node.id] || { x: 0, y: 0 },
    style: nodeStyles[node.type] || nodeStyles.decision,
    sourcePosition: 'right',
    targetPosition: 'left',
  }));

  const edges = data.edges.map((edge, i) => ({
    id: `e${i}`,
    source: edge.from,
    target: edge.to,
    type: 'smoothstep',
    style: { strokeWidth: 2 },
    markerEnd: {
      type: 'arrowclosed',
      color: '#666',
    },
  }));

  return { nodes, edges };
};

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const { nodes, edges } = generateHorizontalFlowElements(flowchart_data);
  const [nodesState, _setNodes] = useNodesState(initialNodes);
  const [edgesState, _setEdges] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.id);
  }, []);

  const closePanel = () => {
    setSelectedNode(null);
  };

  const nodeDetail = selectedNode ? nodeDetails[selectedNode] : null;
  
  return (
    <div style={{ width: '100%', height: '100vh', background: '#fafafa', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        zIndex: 10, 
        background: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Educational Pathways in Morocco</h3>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <div><span style={{ color: '#10b981' }}>●</span> Start • <span style={{ color: '#3b82f6' }}>●</span> Options • <span style={{ color: '#f59e0b' }}>●</span> Process • <span style={{ color: '#dc2626' }}>●</span> Outcomes</div>
        </div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
          Click on any node to see detailed information
        </div>
      </div>
      
      <ReactFlow 
        nodes={nodesState} 
        edges={edgesState} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView 
        fitViewOptions={{ padding: 100 }}
        minZoom={0.5}
        maxZoom={2}
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls />
      </ReactFlow>

      {/* Details Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: selectedNode ? 0 : '-400px',
        width: '400px',
        height: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: selectedNode ? '-10px 0 30px rgba(0,0,0,0.1)' : 'none',
        transition: 'right 0.3s ease',
        zIndex: 100,
        overflow: 'auto',
        borderLeft: selectedNode ? '1px solid #e2e8f0' : 'none'
      }}>
        {selectedNode && nodeDetail && (
          <div style={{ padding: '30px' }}>
            {/* Close button */}
            <button
              onClick={closePanel}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '5px'
              }}
            >
              ×
            </button>

            {/* Content */}
            <h2 style={{ 
              color: '#1f2937', 
              marginBottom: '15px', 
              fontSize: '24px',
              lineHeight: '1.3'
            }}>
              {nodeDetail.title}
            </h2>
            
            <p style={{ 
              color: '#4b5563', 
              marginBottom: '25px', 
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              {nodeDetail.description}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#374151', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Duration</h4>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{nodeDetail.duration}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#374151', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Requirements</h4>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{nodeDetail.requirements}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#374151', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Next Steps</h4>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{nodeDetail.nextSteps}</p>
            </div>

            {nodeDetail.pros && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#059669', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Pros</h4>
                <ul style={{ color: '#6b7280', fontSize: '13px', marginLeft: '15px' }}>
                  {nodeDetail.pros.map((pro, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}

            {nodeDetail.cons && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#dc2626', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Cons</h4>
                <ul style={{ color: '#6b7280', fontSize: '13px', marginLeft: '15px' }}>
                  {nodeDetail.cons.map((con, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay when panel is open */}
      {selectedNode && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 'calc(100% - 400px)',
            height: '100vh',
            background: 'rgba(0,0,0,0.1)',
            zIndex: 50
          }}
          onClick={closePanel}
        />
      )}
    </div>
  );
}

export default App;