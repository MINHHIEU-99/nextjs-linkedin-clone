'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Interfaces
interface Person {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string;
}

interface Post {
  id: number;
  author: Person;
  timestamp: string;
  content: string;
  media?: { type: 'image'; url: string };
  likes: number;
  comments: number;
  reposts: number;
  sends: number;
  initialComments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  avatarUrl: string;
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

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'connection' | 'mention';
  content: string;
  timestamp: string;
}

interface ConnectionRequest {
  id: number;
  sender: Person;
  message: string;
  timestamp: string;
}

interface UserProfile {
  name: string;
  headline: string;
  avatarUrl: string;
  profileViews: number;
  postImpressions: number;
  skills: string[];
  jobPreferences: { location: string; remote: boolean; hybrid: boolean };
}

// Mock Data
let userProfile: UserProfile = {
  name: "Allen Miller",
  headline: "Ex-Microsoft | Senior Software Engineer | Building for the future",
  avatarUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]",
  profileViews: 128,
  postImpressions: 845,
  skills: ["JavaScript", "React", "Node.js"],
  jobPreferences: { location: "All", remote: true, hybrid: true },
};

const peopleYouMayKnowData: Person[] = [
  { id: 3, name: "Jeff Bezos", headline: "Founder and Executive Chair at Amazon", avatarUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]" },
  { id: 4, name: "Melinda Gates", headline: "Co-chair at Bill & Melinda Gates Foundation", avatarUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]" },
  { id: 5, name: "Reid Hoffman", headline: "Co-Founder of LinkedIn", avatarUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]" },
];

let connectionsData: Person[] = [
  { id: 1, name: "Satya Nadella", headline: "Chairman and CEO at Microsoft", avatarUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]" },
  { id: 2, name: "Sundar Pichai", headline: "CEO at Google", avatarUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]" },
];

const notificationsData: Notification[] = [
  { id: 1, type: "like", content: "Satya Nadella liked your post", timestamp: "1h ago" },
  { id: 2, type: "connection", content: "Sundar Pichai sent you a connection request", timestamp: "2h ago" },
];

const jobsData: Job[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Microsoft",
    location: "Remote",
    description: "Work on Azure cloud services and developer tools.",
    posted: "2d ago",
    logoUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Google",
    location: "Hybrid",
    description: "Lead product development for Google Cloud.",
    posted: "1d ago",
    logoUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]",
  },
];

let connectionRequestsData: ConnectionRequest[] = [
  { id: 1, sender: peopleYouMayKnowData[0], message: "Hi Allen, I'd love to connect and discuss potential opportunities at Amazon.", timestamp: "1d ago" },
  { id: 2, sender: peopleYouMayKnowData[1], message: "Hello Allen, let's connect to share insights on philanthropy and tech.", timestamp: "2d ago" },
];

// Simulate API with 3G throttling
const simulate3GDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 200));

const mockApi = {
  getPeopleYouMayKnow: async () => {
    await simulate3GDelay();
    return peopleYouMayKnowData;
  },
  getConnections: async () => {
    await simulate3GDelay();
    return connectionsData;
  },
  getNotifications: async () => {
    await simulate3GDelay();
    return notificationsData;
  },
  getJobs: async () => {
    await simulate3GDelay();
    return jobsData;
  },
  getProfile: async () => {
    await simulate3GDelay();
    return userProfile;
  },
  updateProfile: async (updatedProfile: UserProfile) => {
    await simulate3GDelay();
    userProfile = { ...userProfile, ...updatedProfile };
    return userProfile;
  },
  handleConnectionRequest: async (requestId: number, action: 'accept' | 'reject') => {
    await simulate3GDelay();
    const index = connectionRequestsData.findIndex(req => req.id === requestId);
    if (index !== -1) {
      if (action === 'accept') {
        connectionsData = [...connectionsData, connectionRequestsData[index].sender];
      }
      connectionRequestsData = connectionRequestsData.filter(req => req.id !== requestId);
      return { success: true };
    }
    return { success: false };
  },
  getConnectionRequests: async () => {
    await simulate3GDelay();
    return connectionRequestsData;
  },
};

// Components
function ProfileSummaryCard({ onEdit }: { onEdit: () => void }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await mockApi.getProfile();
        setProfile(data);
        setLoading(false);
      } catch {
        setError('Failed to load profile');
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return null;

  return (
    <div style={styles.card}>
      <img src={profile.avatarUrl} alt={profile.name} style={styles.avatar} width={72} height={72} loading="lazy" />
      <div style={styles.info}>
        <h2 style={styles.name}>{profile.name}</h2>
        <p style={styles.headline}>{profile.headline}</p>
        <div style={styles.stats}>
          <p>Profile Views: {profile.profileViews}</p>
          <p>Post Impressions: {profile.postImpressions}</p>
        </div>
        <button onClick={onEdit} style={styles.editButton} aria-label="Edit profile">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

function PeopleYouMayKnow({ people }: { people: Person[] }) {
  const [following, setFollowing] = useState<Set<number>>(new Set());

  const toggleFollow = (id: number) => {
    setFollowing(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.header}>People You May Know</h2>
      <div style={styles.peopleContainer}>
        {people.map(person => (
          <div key={person.id} style={styles.person}>
            <img src={person.avatarUrl} alt={person.name} style={styles.avatar} width={48} height={48} loading="lazy" />
            <div>
              <p style={styles.name}>{person.name}</p>
              <p style={styles.headline}>{person.headline}</p>
              <button
                onClick={() => toggleFollow(person.id)}
                style={following.has(person.id) ? styles.unfollowButton : styles.followButton}
                aria-label={following.has(person.id) ? `Unfollow ${person.name}` : `Follow ${person.name}`}
              >
                {following.has(person.id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyNetwork({ connections }: { connections: Person[] }) {
  const [following, setFollowing] = useState<Set<number>>(new Set(connections.map(c => c.id)));

  const toggleFollow = (id: number) => {
    setFollowing(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.header}>My Network</h2>
      {connections.map(person => (
        <div key={person.id} style={styles.person}>
          <img src={person.avatarUrl} alt={person.name} style={styles.avatar} width={48} height={48} loading="lazy" />
          <div>
            <p style={styles.name}>{person.name}</p>
            <p style={styles.headline}>{person.headline}</p>
            <button
              onClick={() => toggleFollow(person.id)}
              style={following.has(person.id) ? styles.unfollowButton : styles.followButton}
              aria-label={following.has(person.id) ? `Unfollow ${person.name}` : `Follow ${person.name}`}
            >
              {following.has(person.id) ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PostCreation({ onPost }: { onPost: (content: string, image: string | null) => void }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content, image);
      setContent('');
      setImage(null);
    }
  };

  return (
    <div style={styles.card}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind, Allen?"
        style={styles.textarea}
        aria-label="Create a post"
      />
      {image && (
        <div style={styles.imagePreview}>
          <img src={image} alt="Preview" style={styles.previewImage} />
          <button onClick={() => setImage(null)} style={styles.removeButton} aria-label="Remove image">
            ✕
          </button>
        </div>
      )}
      <div style={styles.actions}>
        <label style={styles.actionButton}>
          🖼️ Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            aria-label="Upload image"
          />
        </label>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          style={styles.postButton}
          aria-label="Submit post"
        >
          Post
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
  const [postComments, setPostComments] = useState(post.initialComments);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handleRepost = () => {
    setReposts(reposts + 1);
    onRepost(post);
  };

  const addComment = () => {
    if (newComment.trim()) {
      setPostComments([
        ...postComments,
        {
          id: Date.now(),
          author: 'Allen Miller',
          content: newComment,
          timestamp: 'Just now',
          avatarUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]',
        },
      ]);
      setComments(comments + 1);
      setNewComment('');
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <img src={post.author.avatarUrl} alt={post.author.name} style={styles.avatar} width={48} height={48} loading="lazy" />
        <div>
          <p style={styles.authorName}>{post.author.name}</p>
          <p style={styles.timestamp}>{post.timestamp}</p>
        </div>
      </div>
      <p style={styles.content}>{post.content}</p>
      {post.media && post.media.type === 'image' && (
        <img src={post.media.url} alt="Post media" style={styles.media} loading="lazy" />
      )}
      <div style={styles.stats}>
        <span>{likes} Likes</span>
        <span>{comments} Comments • {reposts} Reposts</span>
      </div>
      <div style={styles.actions}>
        <button onClick={toggleLike} style={isLiked ? styles.activeButton : styles.button} aria-label="Like post">
          👍 {isLiked ? 'Unlike' : 'Like'}
        </button>
        <button onClick={() => setShowComments(!showComments)} style={styles.button} aria-label="Show comments">
          💬 Comment
        </button>
        <button onClick={handleRepost} style={styles.button} aria-label="Repost">
          🔄 Repost
        </button>
        <button onClick={() => console.log('Send')} style={styles.button} aria-label="Send post">
          ✉️ Send
        </button>
      </div>
      {showComments && (
        <div style={styles.comments}>
          {postComments.map(comment => (
            <div key={comment.id} style={styles.comment}>
              <img src={comment.avatarUrl} alt={comment.author} style={styles.commentAvatar} width={32} height={32} loading="lazy" />
              <div>
                <p style={styles.commentAuthor}>{comment.author}</p>
                <p style={styles.commentContent}>{comment.content}</p>
                <p style={styles.commentTimestamp}>{comment.timestamp}</p>
              </div>
            </div>
          ))}
          <div style={styles.commentInput}>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={styles.textarea}
              aria-label="Write a comment"
            />
            <button onClick={addComment} disabled={!newComment.trim()} style={styles.commentButton} aria-label="Submit comment">
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Notifications({ notifications }: { notifications: Notification[] }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.header}>Notifications</h2>
      {notifications.map(notification => (
        <div key={notification.id} style={styles.notification}>
          <p style={styles.content}>{notification.content}</p>
          <p style={styles.timestamp}>{notification.timestamp}</p>
        </div>
      ))}
    </div>
  );
}

function Jobs({ jobs }: { jobs: Job[] }) {
  const [filter, setFilter] = useState('all');

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.location.toLowerCase() === filter;
  });

  return (
    <div style={styles.card}>
      <h2 style={styles.header}>Jobs</h2>
      <div style={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          style={filter === 'all' ? styles.activeFilter : styles.filter}
          aria-label="Show all jobs"
        >
          All
        </button>
        <button
          onClick={() => setFilter('remote')}
          style={filter === 'remote' ? styles.activeFilter : styles.filter}
          aria-label="Show remote jobs"
        >
          Remote
        </button>
        <button
          onClick={() => setFilter('hybrid')}
          style={filter === 'hybrid' ? styles.activeFilter : styles.filter}
          aria-label="Show hybrid jobs"
        >
          Hybrid
        </button>
      </div>
      {filteredJobs.map(job => (
        <div key={job.id} style={styles.job}>
          <img src={job.logoUrl} alt={`${job.company} logo`} style={styles.logo} width={48} height={48} loading="lazy" />
          <div>
            <p style={styles.title}>{job.title}</p>
            <p style={styles.company}>{job.company} • {job.location}</p>
            <p style={styles.description}>{job.description}</p>
            <p style={styles.posted}>{job.posted}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileEditPage({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileData, requestsData] = await Promise.all([
          mockApi.getProfile(),
          mockApi.getConnectionRequests(),
        ]);
        setProfile(profileData);
        setConnectionRequests(requestsData);
        setLoading(false);
      } catch {
        setError('Failed to load profile data');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && profile) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    if (profile) {
      setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    }
  };

  const handleJobPreferenceChange = (field: keyof UserProfile['jobPreferences'], value: any) => {
    if (profile) {
      setProfile({
        ...profile,
        jobPreferences: { ...profile.jobPreferences, [field]: value },
      });
    }
  };

  const handleConnectionRequest = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      const response = await mockApi.handleConnectionRequest(requestId, action);
      if (response.success) {
        setConnectionRequests(requests => requests.filter(req => req.id !== requestId));
      } else {
        setError('Failed to process connection request');
      }
    } catch {
      setError('Failed to process connection request');
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      await mockApi.updateProfile(profile);
      onSave();
    } catch {
      setError('Failed to save profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return null;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Edit Profile</h1>
      <section style={styles.section}>
        <h2 style={styles.subHeader}>Skills</h2>
        <div style={styles.skillsContainer}>
          {profile.skills.map(skill => (
            <div key={skill} style={styles.skill}>
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                style={styles.removeButton}
                aria-label={`Remove ${skill}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            style={styles.input}
            aria-label="Add a skill"
          />
          <button
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
            style={styles.addButton}
            aria-label="Add skill"
          >
            Add
          </button>
        </div>
      </section>
      <section style={styles.section}>
        <h2 style={styles.subHeader}>Connection Requests</h2>
        {connectionRequests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          connectionRequests.map(request => (
            <div key={request.id} style={styles.request}>
              <div>
                <p style={styles.requestSender}>{request.sender.name}</p>
                <p style={styles.requestMessage}>{request.message}</p>
                <p style={styles.requestTimestamp}>{request.timestamp}</p>
              </div>
              <div style={styles.requestActions}>
                <button
                  onClick={() => handleConnectionRequest(request.id, 'accept')}
                  style={styles.acceptButton}
                  aria-label={`Accept connection request from ${request.sender.name}`}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleConnectionRequest(request.id, 'reject')}
                  style={styles.rejectButton}
                  aria-label={`Reject connection request from ${request.sender.name}`}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </section>
      <section style={styles.section}>
        <h2 style={styles.subHeader}>Job Preferences</h2>
        <div style={styles.inputContainer}>
          <label style={styles.label}>
            Location
            <input
              type="text"
              value={profile.jobPreferences.location}
              onChange={e => handleJobPreferenceChange('location', e.target.value)}
              style={styles.input}
              aria-label="Job location preference"
            />
          </label>
        </div>
        <div style={styles.checkboxContainer}>
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={profile.jobPreferences.remote}
              onChange={e => handleJobPreferenceChange('remote', e.target.checked)}
              aria-label="Remote job preference"
            />
            Remote
          </label>
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={profile.jobPreferences.hybrid}
              onChange={e => handleJobPreferenceChange('hybrid', e.target.checked)}
              aria-label="Hybrid job preference"
            />
            Hybrid
          </label>
        </div>
      </section>
      <div style={styles.buttonContainer}>
        <button onClick={handleSave} style={styles.saveButton} aria-label="Save profile changes">
          Save Changes
        </button>
        <button onClick={onCancel} style={styles.cancelButton} aria-label="Cancel and return to home">
          Cancel
        </button>
      </div>
    </div>
  );
}

// Main Page
export default function LinkedInClonePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [isEditing, setIsEditing] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [connections, setConnections] = useState<Person[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [peopleData, connectionsData, notificationsData, jobsData] = await Promise.all([
          mockApi.getPeopleYouMayKnow(),
          mockApi.getConnections(),
          mockApi.getNotifications(),
          mockApi.getJobs(),
        ]);
        setPeople(peopleData);
        setConnections(connectionsData);
        setNotifications(notificationsData);
        setJobs(jobsData);
        setPosts([
          {
            id: 1,
            author: { id: 99, name: 'Nikkei Asia', headline: 'News Outlet', avatarUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]' },
            timestamp: '2h',
            content: 'Asia Daily Briefing newsletter\nGet daily updates on Asia\'s top stories...',
            media: { type: 'image', url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]' },
            likes: 578,
            comments: 8,
            reposts: 5,
            sends: 0,
            initialComments: [
              {
                id: 101,
                author: 'Christian Miran',
                content: 'Love this Avani Solanki Prabhakar and saving half a million meetings...',
                timestamp: '3mo',
                avatarUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]',
              },
            ],
          },
        ]);
        setLoading(false);
      } catch {
        setError('Failed to load data');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRepost = (post: Post) => {
    console.log(`Reposted: ${post.content}`);
  };

  const handlePost = (content: string, image: string | null) => {
    const newPost: Post = {
      id: Date.now(),
      author: {
        id: 0,
        name: 'Allen Miller',
        headline: 'Ex-Microsoft | Senior Software Engineer',
        avatarUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...[Placeholder Base64]',
      },
      timestamp: 'Just now',
      content,
      media: image ? { type: 'image', url: image } : undefined,
      likes: 0,
      comments: 0,
      reposts: 0,
      sends: 0,
      initialComments: [],
    };
    setPosts([newPost, ...posts]);
  };

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    if (isEditing) {
      return (
        <ProfileEditPage
          onSave={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <>
            <ProfileSummaryCard onEdit={() => setIsEditing(true)} />
            <PeopleYouMayKnow people={people} />
            <PostCreation onPost={handlePost} />
            {posts.map(post => (
              <FeedPost key={post.id} post={post} onRepost={handleRepost} />
            ))}
          </>
        );
      case 'network':
        return <MyNetwork connections={connections} />;
      case 'notifications':
        return <Notifications notifications={notifications} />;
      case 'jobs':
        return <Jobs jobs={jobs} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>{renderContent()}</div>
      <nav style={styles.bottomNav}>
        <button
          style={activeTab === 'home' ? styles.activeNavButton : styles.navButton}
          onClick={() => setActiveTab('home')}
          aria-label="Home"
        >
          🏠
        </button>
        <button
          style={activeTab === 'network' ? styles.activeNavButton : styles.navButton}
          onClick={() => setActiveTab('network')}
          aria-label="My Network"
        >
          👥
        </button>
        <button
          style={activeTab === 'post' ? styles.activeNavButton : styles.navButton}
          onClick={() => setActiveTab('post')}
          aria-label="Post"
        >
          📝
        </button>
        <button
          style={activeTab === 'notifications' ? styles.activeNavButton : styles.navButton}
          onClick={() => setActiveTab('notifications')}
          aria-label="Notifications"
        >
          🔔
        </button>
        <button
          style={activeTab === 'jobs' ? styles.activeNavButton : styles.navButton}
          onClick={() => setActiveTab('jobs')}
          aria-label="Jobs"
        >
          💼
        </button>
      </nav>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 0 60px 0',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f3f2ef',
    minHeight: '100vh',
  },
  mainContent: {
    padding: '16px',
  },
  bottomNav: {
    position: 'fixed' as 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: '8px 0',
    boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  navButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  activeNavButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#0a66c2',
  },
  card: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  avatar: {
    borderRadius: '50%',
    marginRight: '12px',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
  },
  headline: {
    fontSize: '14px',
    color: '#4b5563',
    margin: '4px 0',
  },
  stats: {
    fontSize: '12px',
    color: '#6b7280',
  },
  editButton: {
    marginTop: '8px',
    padding: '8px 16px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  header: {
    fontSize: '18px',
    marginBottom: '12px',
  },
  peopleContainer: {
    display: 'flex',
    overflowX: 'auto' as 'auto',
    gap: '16px',
  },
  person: {
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    textAlign: 'center' as 'center',
  },
  followButton: {
    padding: '6px 12px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  unfollowButton: {
    padding: '6px 12px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    marginBottom: '12px',
  },
  imagePreview: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
  },
  removeButton: {
    marginLeft: '8px',
    background: 'none',
    border: 'none',
    color: '#dc2626',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: '#e0e7ff',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  postButton: {
    padding: '6px 12px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  authorName: {
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  timestamp: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
  },
  content: {
    marginBottom: '12px',
  },
  media: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover' as 'cover',
    borderRadius: '8px',
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  activeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#0a66c2',
  },
  comments: {
    marginTop: '12px',
  },
  comment: {
    display: 'flex',
    marginBottom: '12px',
  },
  commentAvatar: {
    borderRadius: '50%',
    marginRight: '12px',
    width: '32px',
    height: '32px',
  },
  commentAuthor: {
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  commentContent: {
    margin: '0 0 4px 0',
  },
  commentTimestamp: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
  },
  commentInput: {
    display: 'flex',
    gap: '8px',
  },
  commentButton: {
    padding: '6px 12px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  notification: {
    marginBottom: '12px',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  filter: {
    padding: '6px 12px',
    backgroundColor: '#e0e7ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  activeFilter: {
    padding: '6px 12px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  job: {
    display: 'flex',
    marginBottom: '12px',
  },
  logo: {
    borderRadius: '50%',
    marginRight: '12px',
  },
  title: {
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  company: {
    fontSize: '14px',
    color: '#4b5563',
    margin: '0 0 4px 0',
  },
  description: {
    fontSize: '14px',
    margin: '0 0 4px 0',
  },
  posted: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
  },
  section: {
    marginBottom: '24px',
  },
  subHeader: {
    fontSize: '18px',
    marginBottom: '12px',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  skill: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  inputContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  input: {
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    flex: 1,
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  request: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  requestSender: {
    fontWeight: 'bold',
  },
  requestMessage: {
    fontSize: '14px',
    color: '#4b5563',
  },
  requestTimestamp: {
    fontSize: '12px',
    color: '#6b7280',
  },
  requestActions: {
    display: 'flex',
    gap: '8px',
  },
  acceptButton: {
    padding: '6px 12px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejectButton: {
    padding: '6px 12px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  checkboxContainer: {
    display: 'flex',
    gap: '16px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};