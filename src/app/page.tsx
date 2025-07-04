"use client";

import React, { useState, useEffect } from 'react';

// --- MOCK DATA & API SIMULATION ---

const userProfile = {
  name: "Allen Miller",
  headline: "Ex-Microsoft | Senior Software Engineer | Building for the future",
  avatarUrl: "https://i.pravatar.cc/150?u=allen",
  profileViews: 128,
  postImpressions: 845,
};

const connectionsData = [
  { id: 1, name: 'Satya Nadella', headline: 'Chairman and CEO at Microsoft', avatarUrl: 'https://i.pravatar.cc/150?u=satya' },
  { id: 2, name: 'Sundar Pichai', headline: 'CEO at Google', avatarUrl: 'https://i.pravatar.cc/150?u=sundar' },
  { id: 3, name: 'Sarah Drasner', headline: 'VP of Developer Experience at Netlify', avatarUrl: 'https://i.pravatar.cc/150?u=sarah' },
];

const peopleYouMayKnowData = [
  { id: 1, name: 'Satya Nadella', headline: 'Chairman and CEO at Microsoft', avatarUrl: 'https://i.pravatar.cc/150?u=satya' },
  { id: 2, name: 'Sundar Pichai', headline: 'CEO at Google', avatarUrl: 'https://i.pravatar.cc/150?u=sundar' },
  { id: 3, name: 'Jeff Bezos', headline: 'Founder and Executive Chair at Amazon', avatarUrl: 'https://i.pravatar.cc/150?u=jeff' },
  { id: 4, name: 'Melinda Gates', headline: 'Co-chair at Bill & Melinda Gates Foundation', avatarUrl: 'https://i.pravatar.cc/150?u=melinda' },
  { id: 5, name: 'Reid Hoffman', headline: 'Co-Founder of LinkedIn', avatarUrl: 'https://i.pravatar.cc/150?u=reid' },
];

const feedPostsData = [
  {
    id: 1,
    author: { name: 'Nikkei Asia', avatarUrl: 'https://i.pravatar.cc/150?u=nikkeiasia' },
    timestamp: '2h',
    content: 'Asia Daily Briefing newsletter\nGet daily updates on Asia\'s top stories of business, politics, tech and more.\nSign up now >',
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop' },
    likes: 578,
    comments: 8,
    reposts: 5,
    sends: 0,
    initialComments: [
      {
        id: 101,
        author: 'Christian Miran',
        content: 'Love this Avani Solanki Prabhakar and saving half a million meetings is an amazing stat!',
        timestamp: '3mo',
        avatarUrl: 'https://i.pravatar.cc/150?u=christian',
      },
      {
        id: 102,
        author: 'Maaz Khan',
        content: 'Love this!',
        timestamp: '1w',
        avatarUrl: 'https://i.pravatar.cc/150?u=maaz',
      },
    ],
  },
  {
    id: 2,
    author: { name: 'Sarah Drasner', avatarUrl: 'https://i.pravatar.cc/150?u=sarah' },
    timestamp: '1d',
    content: 'Just published a new article on advanced animation techniques in React. #React #WebDev',
    media: null,
    likes: 876,
    comments: 112,
    reposts: 30,
    sends: 15,
    initialComments: [
      {
        id: 201,
        author: 'Alex Lee',
        content: 'Great article, Sarah! Learned a lot.',
        timestamp: '1d',
        avatarUrl: 'https://i.pravatar.cc/150?u=alex',
      },
      {
        id: 202,
        author: 'Priya Patel',
        content: 'Thanks for sharing these tips!',
        timestamp: '22h',
        avatarUrl: 'https://i.pravatar.cc/150?u=priya',
      },
    ],
  },
  {
    id: 3,
    author: { name: 'Microsoft Careers', avatarUrl: 'https://i.pravatar.cc/150?u=mscareers' },
    timestamp: '3d',
    content: "We're hiring for several remote-first engineering roles. #Hiring #Microsoft #Azure",
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop' },
    likes: 2300,
    comments: 450,
    reposts: 100,
    sends: 50,
    initialComments: [
      {
        id: 301,
        author: 'Samira Chen',
        content: 'Excited to apply for these roles!',
        timestamp: '2d',
        avatarUrl: 'https://i.pravatar.cc/150?u=samira',
      },
      {
        id: 302,
        author: 'John Doe',
        content: 'Is there an opening for frontend developers?',
        timestamp: '1d',
        avatarUrl: 'https://i.pravatar.cc/150?u=john',
      },
    ],
  },
];

const notificationsData = [
  { id: 1, type: 'like', user: 'Satya Nadella', action: 'liked your post', timestamp: '1h' },
  { id: 2, type: 'comment', user: 'Sarah Drasner', action: 'commented on your post', timestamp: '4h' },
  { id: 3, type: 'connection', user: 'Jeff Bezos', action: 'sent you a connection request', timestamp: '1d' },
  { id: 4, type: 'mention', user: 'TechCrunch', action: 'mentioned you in a post', timestamp: '2d' },
];

const jobsData = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Microsoft',
    location: 'Remote',
    description: 'Work on Azure cloud services and developer tools.',
    posted: '2d ago',
    logoUrl: 'https://i.pravatar.cc/150?u=microsoft',
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Mountain View, CA',
    description: 'Build user interfaces for Google Workspace.',
    posted: '1w ago',
    logoUrl: 'https://i.pravatar.cc/150?u=google',
  },
  {
    id: 3,
    title: 'Full Stack Engineer',
    company: 'Amazon',
    location: 'Seattle, WA (Hybrid)',
    description: 'Develop scalable e-commerce solutions for AWS.',
    posted: '3d ago',
    logoUrl: 'https://i.pravatar.cc/150?u=amazon',
  },
];

interface Person {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  avatarUrl: string;
}

interface Post {
  id: number;
  author: { name: string; avatarUrl: string };
  timestamp: string;
  content: string;
  media?: { type: 'image'; url: string };
  likes: number;
  comments: number;
  reposts: number;
  sends: number;
  initialComments?: Comment[];
}

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'connection' | 'mention';
  user: string;
  action: string;
  timestamp: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  posted: string;
  logoUrl: string;
}

const fetchPeopleYouMayKnow = async (): Promise<Person[]> => {
  return new Promise(resolve => setTimeout(() => resolve(peopleYouMayKnowData)));
};

const fetchConnections = async (): Promise<Person[]> => {
  return new Promise(resolve => setTimeout(() => resolve(connectionsData)));
};

const fetchNotifications = async (): Promise<Notification[]> => {
  return new Promise(resolve => setTimeout(() => resolve(notificationsData)));
};

const fetchJobs = async (): Promise<Job[]> => {
  return new Promise(resolve => setTimeout(() => resolve(jobsData)));
};

// --- SVG ICONS ---

const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? 'black' : 'currentColor'} width="24" height="24">
    <path d="M20 9v11h-4v-7H8v7H4V9L12 3l8 6z" />
  </svg>
);

const NetworkIcon = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? 'black' : 'currentColor'} width="24" height="24">
    <path d="M16 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-8 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8 0c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
  </svg>
);

const PostIcon = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? 'black' : 'currentColor'} width="24" height="24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const BellIcon = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? 'black' : 'currentColor'} width="24" height="24">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const JobsIcon = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? 'black' : 'currentColor'} width="24" height="24">
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
  </svg>
);

const LikeIcon = ({ isLiked }: { isLiked?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? '#0A66C2' : 'none'} stroke={isLiked ? '#0A66C2' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const CommentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const RepostIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);
// --- UI COMPONENTS ---

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleMessagePopup = () => {
    setShowMessagePopup(!showMessagePopup);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      const posts = feedPostsData.filter(post =>
        post.content.toLowerCase().includes(query) || post.author.name.toLowerCase().includes(query)
      );
      const people = [...connectionsData, ...peopleYouMayKnowData].filter(person =>
        person.name.toLowerCase().includes(query) || person.headline.toLowerCase().includes(query)
      );
      const jobs = jobsData.filter(job =>
        job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query) || job.description.toLowerCase().includes(query)
      );
      setSearchResults([...posts.map(p => ({ type: 'post', ...p })), ...people.map(p => ({ type: 'person', ...p })), ...jobs.map(j => ({ type: 'job', ...j }))]);
    } else {
      setSearchResults([]);
    }
  };
  return (
    <>
      <header className="header">
        {!isSearchOpen ? (
          <>
            <img src={userProfile.avatarUrl} alt="Allen's avatar" className="header-avatar" width={32} height={32} loading="lazy"/>
            <div className="search-bar" role="search" tabIndex={0} onClick={handleSearchClick}>
              <SearchIcon />
              <span>Search</span>
            </div>

            <div className="message-icon" onClick={toggleMessagePopup} aria-label="Messages">
              <MessageIcon />
            </div>
          </>
        ) : (
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search posts, people, or jobs..."
              autoFocus
              aria-label="Search input"
            />
            <button className="close-button" onClick={handleCloseSearch} aria-label="Close search">
              <CloseIcon />
            </button>
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <div key={index} className="search-result-item">
                    {result.type === 'post' && (
                      <div>
                        <p><strong>Post by {result.author.name}</strong></p>
                        <p>{result.content.substring(0, 50)}...</p>
                      </div>
                    )}
                    {result.type === 'person' && (
                      <div>
                        <p><strong>{result.name}</strong></p>
                        <p>{result.headline}</p>
                      </div>
                    )}
                    {result.type === 'job' && (
                      <div>
                        <p><strong>{result.title}</strong> at {result.company}</p>
                        <p>{result.location}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
      {showMessagePopup && <MessagePopup onClose={toggleMessagePopup} />}
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background-color: white;
          display: flex;
          align-items: center;
          padding: 0 16px;
          border-bottom: 1px solid #e0e0e0;
          z-index: 100;
        }
        .header-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          
        }
        .search-bar {
          flex-grow: 1;
          height: 34px;
          background-color: #EEF3F8;
          border-radius: 4px;
          margin: 0 16px;
          display: flex;
          align-items: center;
          padding: 0 8px;
          color: #606060;
          cursor: pointer;
        }
        .search-bar span {
          margin-left: 8px;
          font-weight: 500;
        }
        .message-icon {
          color: #606060;
        }
        .message-icon:hover {
          color: black;
        }
        .message-icon:focus {
          outline: none;
        }
        .search-input-container {
          position: relative;
          flex-grow: 1;
        }
        .search-input {
          width: 100%;
          height: 34px;
          padding: 0 8px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          color: #333;
          background-color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .search-input:focus {
          outline: none;
          border-color: #0A66C2; /* LinkedIn blue */
        }
        .close-button {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #606060;
        }
        .close-button:hover {
          color: black;
        }
        .close-button:focus {
          outline: none;
        }
        .close-button svg {
          width: 18px;
          height: 18px;
        }
        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 102; /* Increased z-index to ensure it appears above other content */
          margin-top: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .search-result-item {
          padding: 8px;
          border-bottom: 1px solid #e0e0e0;
          color: black; /* Set text color to black */
        }
        .search-result-item:last-child {
          border-bottom: none;
        }
        .search-result-item p {
          margin: 2px 0;
          font-size: 14px;
          color: black; /* Ensure all text is black */
        }
        .search-result-item strong {
          color: #0A66C2; /* Keep strong text blue for emphasis */
        }
      `}</style>
    </>
  );
}

function MessagePopup({ onClose }: { onClose: () => void }) {
  const mockMessages: Message[] = [
    {
      id: 1,
      sender: 'Satya Nadella',
      avatarUrl: 'https://i.pravatar.cc/150?u=satya',
      content: 'Hey Allen, interested in discussing a potential collaboration?',
      timestamp: '03:45 PM +07, June 25, 2025',
    },
    {
      id: 2,
      sender: 'Sundar Pichai',
      avatarUrl: 'https://i.pravatar.cc/150?u=sundar',
      content: 'Great post on React! Let’s catch up soon.',
      timestamp: '02:30 PM +07, June 25, 2025',
    },
    {
      id: 3,
      sender: 'Sarah Drasner',
      avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
      content: 'Thanks for the follow! Check out my latest article.',
      timestamp: '10:15 AM +07, June 25, 2025',
    },
  ];

  return (
    <div className="message-popup-overlay" onClick={onClose}>
      <div className="message-popup" onClick={(e) => e.stopPropagation()}>
        <h4>Messages</h4>
        <div className="message-list">
          {mockMessages.map((message) => (
            <div key={message.id} className="message-item">
              <img src={message.avatarUrl} alt={message.sender} className="message-avatar" width={32} height={32} loading="lazy"/>
              <div className="message-content">
                <p className="message-sender"><strong>{message.sender}</strong></p>
                <p className="message-text">{message.content}</p>
                <p className="message-timestamp">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BottomNavBar({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [activeTab, setLocalActiveTab] = useState('Home');
  const navItems = [
    { name: 'Home', icon: <HomeIcon active={activeTab === 'Home'} /> },
    { name: 'My Network', icon: <NetworkIcon active={activeTab === 'My Network'} /> },
    { name: 'Post', icon: <PostIcon active={activeTab === 'Post'} /> },
    { name: 'Notifications', icon: <BellIcon active={activeTab === 'Notifications'} /> },
    { name: 'Jobs', icon: <JobsIcon active={activeTab === 'Jobs'} /> },
  ];

  const handleTabChange = (tab: string) => {
    setLocalActiveTab(tab);
    setActiveTab(tab);
  };

  return (
    <>
      <nav className="bottom-nav">
        {navItems.map(item => (
          <button
            key={item.name}
            className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
            onClick={() => handleTabChange(item.name)}
            aria-label={item.name}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.name}</span>
          </button>
        ))}
      </nav>
      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: white;
          display: flex;
          justify-content: space-around;
          border-top: 1px solid #e0e0e0;
          z-index: 100;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          color: #666666;
          background: none;
          border: none;
          padding: 4px 0;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-item.active {
          color: black;
        }
        .nav-label {
          font-size: 10px;
          margin-top: 2px;
        }
      `}</style>
    </>
  );
}

function ProfileSummaryCard() {
  return (
    <div className="card">
      <div className="profile-summary">
        <img src={userProfile.avatarUrl} alt="Allen's avatar" className="profile-avatar" width={72} height={72} loading="lazy"/>
        <h3>{userProfile.name}</h3>
        <p className="headline">{userProfile.headline}</p>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-label">Profile Views</span>
          <span className="stat-value">{userProfile.profileViews}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Post Impressions</span>
          <span className="stat-value">{userProfile.postImpressions}</span>
        </div>
      </div>
      <div className="profile-actions">
        <h4 className="actions-title">Profile & Job Settings:</h4>
        <ul className="actions-list">
          <li>Edit Skill Endorsements</li>
          <li>Manage Connection Requests</li>
          <li>Set Job Search Filters (Actively looking)</li>
        </ul>
      </div>
    </div>
  );
}

function PeopleYouMayKnow() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPeopleYouMayKnow();
        setPeople(data);
      } catch {
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFollowToggle = (id: number) => {
    setFollowing(prev => {
      const newFollowing = new Set(prev);
      if (newFollowing.has(id)) {
        newFollowing.delete(id);
      } else {
        newFollowing.add(id);
      }
      return newFollowing;
    });
  };

  if (error) return <p className="error-text">{error}</p>;
  if (loading) return <p className="loading-text">Loading recommendations...</p>;

  return (
    <div className="card">
      <h4>People You May Know</h4>
      <div className="swipeable-container">
        {people.map((person) => (
          <div key={person.id} className="person-card">
            <img src={person.avatarUrl} alt={person.name} className="person-avatar" width={56} height={56} loading="lazy"/>
            <p className="person-name">{person.name}</p>
            <p className="person-headline">{person.headline}</p>
            <button className={`follow-button ${following.has(person.id) ? 'following' : ''}`} onClick={() => handleFollowToggle(person.id)} aria-label={`Follow ${person.name}`}>
              {following.has(person.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyNetwork() {
  const [connections, setConnections] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchConnections();
        setConnections(data);
      } catch {
        setError('Failed to load connections');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFollowToggle = (id: number) => {
    setFollowing(prev => {
      const newFollowing = new Set(prev);
      if (newFollowing.has(id)) {
        newFollowing.delete(id);
      } else {
        newFollowing.add(id);
      }
      return newFollowing;
    });
  };

  if (error) return <p className="error-text">{error}</p>;
  if (loading) return <p className="loading-text">Loading connections...</p>;

  return (
    <div className="card">
      <h4>My Connections</h4>
      <div className="connections-container">
        {connections.map((connection) => (
          <div key={connection.id} className="connection-card">
            <img src={connection.avatarUrl} alt={connection.name} className="connection-avatar" width={48} height={48} loading="lazy"/>
            <div className="connection-info">
              <p className="connection-name">{connection.name}</p>
              <p className="connection-headline">{connection.headline}</p>
            </div>
            <button className={`follow-button ${following.has(connection.id) ? 'following' : ''}`} onClick={() => handleFollowToggle(connection.id)} aria-label={`Follow ${connection.name}`}>
              {following.has(connection.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostCreation({ onPostCreated }: { onPostCreated: (post: Post) => void }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: { name: userProfile.name, avatarUrl: userProfile.avatarUrl },
      timestamp: 'Just now',
      content,
      media: image ? { type: 'image', url: image } : null,
      likes: 0,
      comments: 0,
      reposts: 0,
      sends: 0,
      initialComments: [],
    };
    onPostCreated(newPost);
    setContent('');
    setImage(null);
    setShowEditor(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="card post-creation-container">
    {showEditor ? (
        <>
          <div className="post-creation-row">
            <img src={userProfile.avatarUrl} alt="avatar" className="post-creation-avatar" width={48} height={48} loading="lazy"/>
            <textarea
              className="post-creation-input"
              placeholder="Start a post"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="post-creation-actions">
            <button className="action-btn video"><span>▶️</span> Video</button>
            <button className="action-btn photo"><span>🖼️</span> Photo</button>
            <button className="action-btn article" onClick={handlePost} disabled={!content.trim()} aria-label="Submit post"><span>📝</span> Post</button>
          </div>
        </>
      ) : (
        <div className="post-creation-row">
          <img src={userProfile.avatarUrl} alt="avatar" className="post-creation-avatar" width={48} height={48} loading="lazy"/>
          <button
            className="post-creation-input"
            onClick={() => setShowEditor(true)}
            aria-label="Start a post"
          >
            Start a post
          </button>
        </div>
      )}
    </div>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (loading) return <p className="loading-text">Loading notifications...</p>;

  return (
    <div className="card">
      <h4>Notifications</h4>
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <p className="notification-text">
              <strong>{notification.user}</strong> {notification.action}
            </p>
            <p className="notification-timestamp">{notification.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredJobs = filter === 'all' ? jobs : jobs.filter((job) => job.location.toLowerCase().includes(filter.toLowerCase()));

  if (error) return <p className="error-text">{error}</p>;
  if (loading) return <p className="loading-text">Loading jobs...</p>;

  return (
    <div className="card">
      <h4>Job Opportunities</h4>
      <div className="job-filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          aria-label="Show all jobs"
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'remote' ? 'active' : ''}`}
          onClick={() => setFilter('remote')}
          aria-label="Show remote jobs"
        >
          Remote
        </button>
        <button
          className={`filter-button ${filter === 'hybrid' ? 'active' : ''}`}
          onClick={() => setFilter('hybrid')}
          aria-label="Show hybrid jobs"
        >
          Hybrid
        </button>
      </div>
      <div className="jobs-container">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <img src={job.logoUrl} alt={`${job.company} logo`} className="job-logo" width={48} height={48} loading="lazy"/>
            <div className="job-info">
              <p className="job-title">{job.title}</p>
              <p className="job-company">{job.company} • {job.location}</p>
              <p className="job-description">{job.description}</p>
              <p className="job-posted">{job.posted}</p>
            </div>
            <button className="apply-button" aria-label={`Apply to ${job.title} at ${job.company}`}>
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SendModal({ post, following, onClose, onSend }: { post: Post; following: Set<number>; onClose: () => void; onSend: (recipients: Person[]) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Set<number>>(new Set());

  const filteredPeople = peopleYouMayKnowData.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) || person.headline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    const recipients = peopleYouMayKnowData.filter(person => selectedRecipients.has(person.id));
    onSend(recipients);
    onClose();
  };

  return (
    <div className="send-modal-overlay" onClick={onClose}>
      <div className="send-modal" onClick={(e) => e.stopPropagation()}>
        <h4>Send to</h4>
        <input
          type="text"
          className="send-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search followers..."
          aria-label="Search followers"
        />
        <div className="send-recipients-list">
          {filteredPeople.map((person) => (
            <div key={person.id} className="send-recipient-item">
              <label>
                <img src={person.avatarUrl} alt={person.name} className="send-recipient-avatar" width={32} height={32} loading="lazy"/>
                <span className="send-recipient-name">{person.name}</span>
                <span className="send-recipient-headline">{person.headline}</span>
              </label>
              <input
                type="checkbox"
                checked={selectedRecipients.has(person.id)}
                onChange={(e) => {
                  const newSelected = new Set(selectedRecipients);
                  if (e.target.checked) {
                    newSelected.add(person.id);
                  } else {
                    newSelected.delete(person.id);
                  }
                  setSelectedRecipients(newSelected);
                }}
                aria-label={`Select ${person.name} to send`}
              />
            </div>
          ))}
        </div>
        <button className="send-submit-button" onClick={handleSend} disabled={selectedRecipients.size === 0} aria-label="Send post">
          Send
        </button>
      </div>
    </div>
  );
}

function FeedPost({ post, onRepost }: { post: Post; onRepost: (post: Post) => void }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [reposts, setReposts] = useState(post.reposts);
  const [sends, setSends] = useState(post.sends);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState(post.initialComments || []);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [following, setFollowing] = useState<Set<number>>(new Set());

  const ActionButton = ({
    icon,
    count,
    onClick,
    label,
    active = false,
  }: {
    icon: React.ReactNode;
    count?: number;
    onClick: () => void;
    label: string;
    active?: boolean;
  }) => (
    <button
      className={`action-button${active ? ' active' : ''}`}
      onClick={onClick}
      aria-label={`${label}${count !== undefined ? ` (${count})` : ''}`}
    >
      <div className="action-content">{icon}</div>
      <span className="action-label">{label}</span>
      
    </button>
  );

  const toggleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleRepost = () => {
    setReposts(reposts + 1);
    onRepost(post);
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: userProfile.name,
        content: newComment,
        timestamp: 'Just now',
        avatarUrl: 'https://i.pravatar.cc/150?u=allen',
      };
      setPostComments([...postComments, comment]);
      setComments(comments + 1);
      setNewComment('');
    }
  };

  const handleSend = (recipients: Person[]) => {
    setSends(sends + recipients.length);
    console.log(`Sent to: ${recipients.map(r => r.name).join(', ')}`);
  };

  return (
    <div className="card feed-post">
      <div className="post-header">
        <img src={post.author.avatarUrl} alt={post.author.name} className="author-avatar" width={48} height={48} loading="lazy"/>
        <div className="author-info">
          <p className="author-name">{post.author.name}</p>
          <p className="post-timestamp">{post.timestamp}</p>
        </div>
      </div>
      <div className="post-content-container" style={{ backgroundColor: post.id === 1 ? '#0A66C2' : 'inherit', color: post.id === 1 ? 'white' : 'inherit' }}>
        <p className="post-content">{post.content}</p>
        {post.media && post.media.type === 'image' && (
          <img src={post.media.url} alt="Post media" className="post-media" width={800} height={400} loading="lazy" />
        )}
      </div>
      <div className="post-stats">
        <span>{likes} Likes</span>
        <div>
          <span
            className="comments-count"
            onClick={() => setShowComments(!showComments)}
            tabIndex={0}
            role="button"
            aria-label="Show comments"
          >{comments} Comments</span> • <span>{reposts} Reposts</span>
        </div>
      </div>
      <div className="post-actions-bar">
        <ActionButton icon={<LikeIcon isLiked={isLiked} />} onClick={toggleLike} label="Like" />
        <ActionButton icon={<CommentIcon />} onClick={() => setShowComments(!showComments)} label="Comment" />
        <ActionButton icon={<RepostIcon />} onClick={handleRepost} label="Repost" />
        <ActionButton icon={<SendIcon />} count={sends} onClick={() => setShowSendModal(true)} label="Send" />
      </div>
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {postComments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <img src={comment.avatarUrl} alt={comment.author} className="comment-avatar" loading="lazy"/>
                <div className="comment-content-block">
                  <div className="comment-author-row">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-timestamp">{comment.timestamp}</span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-actions">
                    <button className="comment-action-btn">Like</button>
                    <button className="comment-action-btn">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="comment-input-container">
            <textarea
              className="comment-input"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              aria-label="Write a comment"
            />
            <button className="comment-submit-button" onClick={addComment} disabled={!newComment.trim()} aria-label="Submit comment">
              Post
            </button>
          </div>
        </div>
      )}
      {showSendModal && (
        <SendModal
          post={post}
          following={following}
          onClose={() => setShowSendModal(false)}
          onSend={handleSend}
        />
      )}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function LinkedInClonePage() {
  const [activeTab, setActiveTab] = useState('Home');
  const [posts, setPosts] = useState<Post[]>(feedPostsData);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleRepost = (originalPost: Post) => {
    const repost: Post = {
      id: Date.now(),
      author: { name: userProfile.name, avatarUrl: userProfile.avatarUrl },
      timestamp: 'Just now',
      content: `Reposted: ${originalPost.content}`,
      media: originalPost.media,
      likes: 0,
      comments: 0,
      reposts: 0,
      sends: 0,
      initialComments: [],
    };
    setPosts([repost, ...posts]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <>
            <ProfileSummaryCard />
            <PeopleYouMayKnow />
            <PostCreation onPostCreated={handlePostCreated} />
            <hr className="divider" />
            {posts.map((post) => <FeedPost key={post.id} post={post} onRepost={handleRepost} />)}

          </>
        );
      case 'My Network':
        return <MyNetwork />;
      case 'Post':
        return <PostCreation onPostCreated={handlePostCreated} />;
      case 'Notifications':
        return <Notifications />;
      case 'Jobs':
        return <Jobs />;
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="mobile-container">
        <Header />
        <main className="main-content">
          {renderContent()}
        </main>
        <BottomNavBar setActiveTab={setActiveTab} />
      </div>
    </>
  );
}

// --- STYLES ---

const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --primary-blue: #0A66C2;
      --background-gray: #F3F2EF;
      --text-color: #000000E6;
      --text-color-secondary: #00000099;
      --card-background: #FFFFFF;
      --border-color: #e0e0e0;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: var(--background-gray);
    }
    * {
      box-sizing: border-box;
    }
    .mobile-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--background-gray);
      position: relative;
    }
    .main-content {
      padding: 55px 0 76px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .card {
      background-color: var(--card-background);
      border: 1px solid var(--border-color);
      padding: 16px;
    }
    .divider {
      border: none;
      border-top: 8px solid var(--background-gray);
      margin: 0;
    }
    .error-text {
      color: red;
      text-align: center;
      padding: 16px;
    }
    .loading-text {
      color: var(--text-color-secondary);
      font-style: italic;
      text-align: center;
      padding: 16px;
    }

    /* ProfileSummaryCard Styles */
    .profile-summary {
      text-align: center;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 16px;
    }
    .profile-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      margin-bottom: 8px;
      margin: 0 auto;
      
    }
    .profile-summary h3 {
      margin: 0 0 4px 0;
      font-size: 20px;
      color: var(--text-color);
    }
    .headline {
      margin: 0;
      font-size: 14px;
      color: var(--text-color-secondary);
    }
    .profile-stats {
      display: flex;
      justify-content: space-around;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color);
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-label {
      font-size: 12px;
      color: var(--text-color-secondary);
    }
    .stat-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-blue);
    }
    .profile-actions {
      padding-top: 12px;
    }
    .actions-title {
      font-size: 14px;
      margin: 0 0 8px 0;
      color: var(--text-color);
    }
    .actions-list {
      margin: 0;
      padding-left: 20px;
      font-size: 14px;
      color: var(--primary-blue);
      cursor: pointer;
    }
    .actions-list li {
      margin-bottom: 4px;
    }

    /* PeopleYouMayKnow Styles */
    .card h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
    }
    .swipeable-container {
      display: flex;
      overflow-x: auto;
      padding-bottom: 12px;
      gap: 12px;
      scrollbar-width: none;
    }
    .swipeable-container::-webkit-scrollbar {
      display: none;
    }
    .person-card {
      flex: 0 0 140px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .person-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: block;
      margin: 0 auto;
    }
    .person-name {
      font-weight: 600;
      font-size: 14px;
      margin: 8px 0 4px 0;
    }
    .person-headline {

      font-size: 12px;
      color: var(--text-color-secondary);
      height: 3em;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .follow-button {
      margin-top: 12px;
      padding: 6px 16px;
      border-radius: 16px;
      border: 1px solid var(--primary-blue);
      color: var(--primary-blue);
      background-color: transparent;
      font-weight: 600;
      cursor: pointer;
    }
    .follow-button.following {
      color: var(--gray-text);
      background-color: var(--gray-background);
      border-color: var(--gray-background);
    }
    .follow-button:hover:not(.following) {
      background-color: #eef3f8;
    }

    /* MyNetwork Styles */
    .connections-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .connection-card {
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid var(--border-color);
    }
    .connection-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .connection-info {
      flex-grow: 1;
    }
    .connection-name {
      font-weight: 600;
      font-size: 14px;
      margin: 0;
    }
    .connection-headline {
      font-size: 12px;
      color: var(--text-color-secondary);
      margin: 4px 0 0 0;
    }
    .message-button {
      padding: 6px 16px;
      border-radius: 16px;
      border: 1px solid var(--primary-blue);
      color: var(--primary-blue);
      background-color: transparent;
      font-weight: 600;
      cursor: pointer;
    }
    .message-button:hover {
      background-color: #eef3f8;
    }

    /* PostCreation Styles */
    .post-creation-container {
      display: flex;
      flex-direction: column;

      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-bottom: 16px;
    }
    .post-creation-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .post-creation-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    .post-creation-input {
      flex: 1;
      background: #f3f2ef;
      border: 1px solid #ccc;
      border-radius: 999px;
      padding: 14px 20px;
      font-size: 18px;
      color: #666;
      text-align: left;
      cursor: pointer;
      outline: none;
      transition: border 0.2s;
      border: 1.5px solid #e0e0e0;
    }
    .post-creation-input:focus,
    .post-creation-input:hover {
      border: 1.5px solid #0A66C2;
      background: #fff;
    }
    
    .post-creation-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      gap: 8px;
    }
    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      color: #666;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .action-btn.video span { color: #37833b; }
    .action-btn.photo span { color: #0a66c2; }
    .action-btn.article span { color: #b24020; }
    .action-btn:hover {
      background: #f3f2ef;
    }

    /* Notifications Styles */
    .notifications-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .notification-item {
      padding: 8px;
      border-bottom: 1px solid var(--border-color);
    }
    .notification-text {
      margin: 0;
      font-size: 14px;
      color: var(--text-color);
    }
    .notification-text strong {
      font-weight: 600;
    }
    .notification-timestamp {
      font-size: 12px;
      color: var(--text-color-secondary);
      margin: 4px 0 0 0;
    }

    /* Jobs Styles */
    .job-filters {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    .filter-button {
      padding: 6px 16px;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      background-color: transparent;
      color: var(--text-color);
      cursor: pointer;
    }
    .filter-button.active, .filter-button:hover {
      background-color: #eef3f8;
      border-color: var(--primary-blue);
      color: var(--primary-blue);
    }
    .jobs-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .job-card {
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid var(--border-color);
    }
    .job-logo {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      margin-right: 12px;
    }
    .job-info {
      flex-grow: 1;
    }
    .job-title {
      font-weight: 600;
      font-size: 14px;
      margin: 0;
    }
    .job-company {
      font-size: 12px;
      color: var(--text-color-secondary);
      margin: 4px 0;
    }
    .job-description {
      font-size: 12px;
      color: var(--text-color);
      margin: 4px 0;
    }
    .job-posted {
      font-size: 12px;
      color: var(--text-color-secondary);
      margin: 4px 0;
    }
    .apply-button {
      padding: 6px 16px;
      border-radius: 16px;
      border: 1px solid var(--primary-blue);
      color: var(--primary-blue);
      background-color: transparent;
      font-weight: 600;
      cursor: pointer;
    }
    .apply-button:hover {
      background-color: #eef3f8;
    }

    /* FeedPost Styles */
    .feed-post {
      padding: 12px 0;
    }
    .post-header {
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .author-info {
      flex-grow: 1;
    }
    .author-name {
      font-weight: 600;
      margin: 0;
    }
    .post-timestamp {
      font-size: 12px;
      color: var(--text-color-secondary);
      margin: 0;
    }
    .post-content-container {
      padding: 16px;
      border-radius: 8px;
      margin: 8px 0;
    }
    .post-content {
      margin: 0;
      font-size: 16px;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    .post-content strong {
      font-weight: 700;
    }
    .post-media {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
      margin-top: 8px;
    }
    .post-stats {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: var(--text-color-secondary);
      padding: 8px 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .post-actions-bar {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px;
      background-color: #F9FAFB;
    }
    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      transition: background-color 0.2s;
    }
    .action-button:hover {
      background-color: #E9ECEF;
    }
    .action-content {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .action-button svg {
      width: 20px;
      height: 20px;
      color: #606060;
    }
    .action-label {
      font-size: 12px;
      color: #606060;
    }
    .action-count {
      font-size: 12px;
      color: #606060;
      margin-top: 2px;
    }

  /* SendModal Styles */
    .send-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .send-modal {
      background-color: var(--card-background);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    }
    .send-search-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .send-recipients-list {
      max-height: 50vh;
      overflow-y: auto;
    }
    .send-recipient-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }
    .send-recipient-item:last-child {
      border-bottom: none;
    }
    .send-recipient-item input[type="checkbox"] {
      margin-right: 8px;
    }
    .send-recipient-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .send-recipient-name {
      font-weight: 600;
      margin-right: 8px;
    }
    .send-recipient-headline {
      color: var(--text-color-secondary);
      font-size: 12px;
    }
    .send-submit-button {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: none;
      background-color: var(--primary-blue);
      color: white;
      font-weight: 600;
      cursor: pointer;
      margin-top: 12px;
    }
    .send-submit-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .send-submit-button:hover:not(:disabled) {
      background-color: #005bb5;
    }
    
    .action-button.active,
    .action-button.active .action-label {
      color: #0A66C2;
    }
    .action-button.active svg {
      stroke: #0A66C2;
      fill: #0A66C2;
    }
    .post-stats span {
      cursor: pointer;
      transition: color 0.2s, text-decoration 0.2s;
    }
    .post-stats span:hover {
      color: #0A66C2;
      text-decoration: underline;
    }
    .comments-count {
      cursor: pointer;
      margin: 0 8px;
    }
    .comments-count:focus {
      outline: 2px solid #0A66C2;
    }
    .comments-section {
      margin-top: 8px;
      background: #fff;
      border-radius: 0 0 12px 12px;
      padding: 0 0 8px 0;
    }
    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 8px;
    }
    .comment-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 0 16px;
    }
    .comment-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-top: 2px;
    }
    .comment-content-block {
      flex: 1;
      background: #f3f2ef;
      border-radius: 12px;
      padding: 10px 16px;
      position: relative;
    }
    .comment-author-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .comment-author {
      font-weight: 600;
      color: #222;
      margin: 0;
      font-size: 15px;
    }
    .comment-timestamp {
      color: #888;
      font-size: 13px;
      margin-left: 4px;
    }
    .comment-content {
      margin: 4px 0 0 0;
      font-size: 15px;
      color: #222;
      line-height: 1.5;
      word-break: break-word;
    }
    .comment-actions {
      display: flex;
      gap: 16px;
      margin-top: 4px;
    }
    .comment-action-btn {
      background: none;
      border: none;
      color: #666;
      font-size: 14px;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
    }
    .comment-action-btn:hover {
      color: #0A66C2;
      text-decoration: underline;
    }
    .comment-input-container {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px 16px 0 16px;
    }
    .comment-input {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 15px;
      resize: none;
      background: #f3f2ef;
      color: #222;
      outline: none;
      transition: border 0.2s;
    }
    .comment-input:focus {
      border: 1.5px solid #0A66C2;
      background: #fff;
    }
    .comment-submit-button {
      background: #0A66C2;
      color: #fff;
      border: none;
      border-radius: 24px;
      padding: 8px 18px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      margin-left: 4px;
      transition: background 0.2s;
    }
    .comment-submit-button:disabled {
      background: #b3d3ea;
      cursor: not-allowed;
    }
  
    /* MessagePopup Styles */
    .message-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .message-popup {
      background-color: var(--card-background);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    }
    .message-list {
      max-height: 60vh;
      overflow-y: auto;
    }
    .message-item {
      display: flex;
      align-items: flex-start;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }
    .message-item:last-child {
      border-bottom: none;
    }
    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .message-content {
      flex-grow: 1;
    }
    .message-sender {
      margin: 0 0 4px 0;
      font-weight: 600;
    }
    .message-text {
      margin: 0 0 4px 0;
      color: var(--text-color);
    }
    .message-timestamp {
      font-size: 12px;
      color: var(--text-color-secondary);
      margin: 0;
    }
  `}</style>
);