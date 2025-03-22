import React from 'react'

const Card = ({data, darkMode}) => {
     console.log(data);
     
     // Helper function to format date
     const formatDate = (dateString) => {
         if (!dateString) return "";
         const date = new Date(dateString);
         return date.toLocaleDateString('en-US', { 
             year: 'numeric', 
             month: 'short', 
             day: 'numeric' 
         });
     };

     // Helper function to truncate text
     const truncateText = (text, maxLength) => {
         if (!text) return '';
         return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
     };

     // Helper function to extract tech-related tags from title or description
     const extractTechTags = (title, description) => {
         const techKeywords = [
             'AI', 'artificial intelligence', 'machine learning', 'ML', 
             'blockchain', 'crypto', 'tech', 'technology', 'software', 
             'hardware', 'programming', 'data', 'cloud', 'IoT', 
             'computing', 'digital', 'cyber', 'robot', 'automate', 
             'algorithm', 'startup', 'innovation', 'computer', 'mobile',
             'app', 'web', 'internet', 'smartphone', 'device', 'gadget',
             '5G', '6G', 'network', 'security', 'privacy', 'hack',
             'VR', 'AR', 'virtual reality', 'augmented reality'
         ];
         
         const fullText = `${title || ''} ${description || ''}`.toLowerCase();
         const foundTags = techKeywords.filter(keyword => 
             fullText.includes(keyword.toLowerCase())
         );
         
         // Return up to 3 unique tags
         return [...new Set(foundTags)].slice(0, 3);
     };
     
  return (
    <div className='cardContainer'>
    {data && data.map((article, index) => {
        const techTags = extractTechTags(article.title, article.description);
        
        return (
        <div className={`card ${darkMode ? 'dark' : ''}`} key={index}>
            {article.urlToImage ? (
                <div className="card-image-container">
                    <img 
                        src={article.urlToImage} 
                        alt={article.title || 'Technology news image'} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/340x200?text=No+Tech+Image';
                        }}
                    />
                    {article.source && article.source.name && (
                        <div className="source-badge">{article.source.name}</div>
                    )}
                </div>
            ) : (
                <div className="card-image-container">
                    <img 
                        src="https://via.placeholder.com/340x200?text=No+Tech+Image" 
                        alt="No technology image available"
                    />
                    {article.source && article.source.name && (
                        <div className="source-badge">{article.source.name}</div>
                    )}
                </div>
            )}
            <div className='content'>
                <div className="card-header">
                    {article.publishedAt && (
                        <small className="publish-date">{formatDate(article.publishedAt)}</small>
                    )}
                    {techTags.length > 0 && (
                        <div className="tech-tags">
                            {techTags.map((tag, i) => (
                                <span key={i} className="tech-tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <a className='title' onClick={() => window.open(article.url)}>
                    {truncateText(article.title, 90)}
                </a>
                <p>{truncateText(article.description || 'No description available for this technology news article.', 150)}</p>
                <div className="card-footer">
                    <button onClick={() => window.open(article.url)}>Read Full Article</button>
                    <div className="article-meta">
                        {article.author && (
                            <span className="author">{truncateText(article.author, 20)}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
        );
    })}
    {(!data || data.length === 0) && (
        <div className={`no-news ${darkMode ? 'dark' : ''}`}>
            <div className="no-results-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>No technology news articles found. Try adjusting your search or selecting a different country.</p>
            </div>
        </div>
    )}
    </div>
  )
}

export default Card