import React, { useEffect, useState } from 'react';

interface CohortMetadata {
  cohortId: string;
  name: string;
  createdAt: string;
  videoUrl?: string;
}

const CohortList: React.FC = () => {
  const [cohorts, setCohorts] = useState<CohortMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/git-gif-mosaic/cohorts.json')
      .then(res => res.json())
      .then(data => {
        setCohorts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading cohorts...</div>;
  }

  if (cohorts.length === 0) {
    return <div className="no-cohorts">No cohorts have been processed yet.</div>;
  }

  return (
    <div className="cohort-grid">
      {cohorts.map(cohort => (
        <a
          key={cohort.cohortId}
          href={`/git-gif-mosaic/cohorts/${cohort.cohortId}`}
          className="cohort-card"
        >
          <div className="cohort-preview">
            {cohort.videoUrl ? (
              <video
                src={cohort.videoUrl}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <div className="placeholder">Processing...</div>
            )}
          </div>
          <h3>{cohort.name}</h3>
          <p>Created: {new Date(cohort.createdAt).toLocaleDateString()}</p>
        </a>
      ))}
    </div>
  );
};

export default CohortList;

<style>{`
  .loading, .no-cohorts {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .cohort-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .cohort-card {
    display: block;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cohort-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
  }

  .cohort-preview {
    width: 100%;
    height: 200px;
    background: #000;
    position: relative;
    overflow: hidden;
  }

  .cohort-preview video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
  }

  .cohort-card h3 {
    margin: 1rem;
    color: #a78bfa;
  }

  .cohort-card p {
    margin: 0 1rem 1rem;
    color: #999;
    font-size: 0.9rem;
  }
`}</style>