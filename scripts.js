// Function to add two numbers
function add(a, b) {
    return a + b;
}

// Function to subtract two numbers
function subtract(a, b) {
    return a - b;
}

// Function to multiply two numbers
function multiply(a, b) {
    return a * b;
}

// Function to divide two numbers
function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero is not allowed.");
    }
    return a / b;
}

// Skills data
const skills = [
    'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow',
    'PyTorch', 'Data Visualization', 'SQL', 'Big Data'
];

// Projects data
const projects = [
    {
        title: 'Machine Learning Classification Model',
        description: 'Developed a classification model for predicting customer churn.',
        technologies: ['Python', 'Scikit-learn', 'Pandas']
    },
    {
        title: 'Natural Language Processing',
        description: 'Sentiment analysis of social media data using BERT.',
        technologies: ['Python', 'Transformers', 'PyTorch']
    },
    {
        title: 'Time Series Forecasting',
        description: 'Sales forecasting using deep learning models.',
        technologies: ['Python', 'TensorFlow', 'Prophet']
    }
];

// Blog posts data
const blogPosts = [
    {
        title: 'Introduction to Neural Networks',
        date: '2023-10-15',
        summary: 'Learn about the basics of neural networks and their applications.'
    },
    {
        title: 'Data Preprocessing Techniques',
        date: '2023-10-01',
        summary: 'Essential techniques for preparing your data for machine learning.'
    }
];

// Certificates data
const certificates = [
    {
        title: 'Machine Learning Professional Certificate',
        issuer: 'IBM',
        date: '2023',
        credential: 'https://www.coursera.org/account/accomplishments/professional-cert/XXXXXX'
    },
    // Add more certificates as needed
];

// GitHub API integration
async function fetchGitHubStats(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        return null;
    }
}

// Updated GitHub API Config
const GITHUB_API_CONFIG = {
    username: 'rbmarquez',
    headers: {
        'Accept': 'application/vnd.github.v3+json'
    }
};

async function fetchGitHubData() {
    try {
        const [profile, repos] = await Promise.all([
            fetchGitHubProfile(),
            fetchGitHubRepos()
        ]);

        if (profile) {
            updateProfileUI(profile);
        }

        if (repos) {
            updateRepositoriesUI(repos);
            updateLanguageStats(repos);
        }

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        showErrorMessage('Failed to load GitHub data. Please try again later.');
    }
}

function updateProfileUI(profile) {
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.src = profile.avatar_url;
        profileImg.alt = `${profile.name || profile.login}'s profile picture`;
    }

    // Update bio
    const bioElement = document.querySelector('.lead');
    if (bioElement) {
        bioElement.textContent = profile.bio || 'Data Science & AI Enthusiast';
    }

    // Update social links
    const githubLink = document.querySelector('a[href*="github.com"]');
    if (githubLink) {
        githubLink.href = profile.html_url;
    }
}

function updateRepositoriesUI(repos) {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    const dataRepos = repos.filter(repo => 
        repo.topics?.some(topic => 
            ['data-science', 'machine-learning', 'ai', 'python', 'jupyter'].includes(topic)
        ) || repo.language === 'Python' || repo.language === 'Jupyter Notebook'
    );

    projectsContainer.innerHTML = dataRepos.slice(0, 6).map(repo => `
        <div class="col-md-4 mb-4">
            <div class="card project-card" data-category="${repo.language?.toLowerCase() || 'other'}">
                <div class="card-body">
                    <h5 class="card-title">${repo.name}</h5>
                    <p class="card-text">${repo.description || 'No description available'}</p>
                    <div class="repo-stats mb-3">
                        <span class="badge bg-primary">⭐ ${repo.stargazers_count}</span>
                        <span class="badge bg-secondary">🍴 ${repo.forks_count}</span>
                        <span class="badge bg-info">${repo.language || 'N/A'}</span>
                    </div>
                    <a href="${repo.html_url}" class="btn btn-primary btn-sm" target="_blank">
                        View Project <i class="fas fa-external-link-alt ms-1"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function updateLanguageStats(repos) {
    const languages = repos.reduce((acc, repo) => {
        if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {});

    const statsContainer = document.getElementById('language-stats');
    const legendContainer = document.getElementById('language-legend');
    if (statsContainer && Object.keys(languages).length > 0) {
        // Clear previous content
        statsContainer.innerHTML = '<canvas></canvas>';
        const ctx = statsContainer.querySelector('canvas');
        
        // Generate colors for languages
        const colors = generateColors(Object.keys(languages).length);
        
        // Create the chart
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(languages),
                datasets: [{
                    data: Object.values(languages),
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: 'white'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${percentage}% (${value} repos)`;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });

        // Create custom legend
        if (legendContainer) {
            legendContainer.innerHTML = Object.keys(languages).map((lang, index) => `
                <div class="language-item">
                    <span class="language-color" style="background-color: ${colors[index]}"></span>
                    <span>${lang} (${languages[lang]})</span>
                </div>
            `).join('');
        }
    }
}

function generateColors(count) {
    const colors = [
        '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', 
        '#e74c3c', '#1abc9c', '#34495e', '#e67e22'
    ];
    return Array(count).fill().map((_, i) => colors[i % colors.length]);
}

function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('main').prepend(alertDiv);
}

// Fetch GitHub repository data
async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_API_CONFIG.username}/repos`, {
            headers: GITHUB_API_CONFIG.headers
        });
        const repos = await response.json();
        
        // Get additional data for each repo
        const reposWithDetails = await Promise.all(repos.map(async (repo) => {
            const languagesResponse = await fetch(repo.languages_url, {
                headers: GITHUB_API_CONFIG.headers
            });
            const languages = await languagesResponse.json();
            return { ...repo, languages };
        }));

        return reposWithDetails;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        return [];
    }
}

// Fetch GitHub user profile
async function fetchGitHubProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_API_CONFIG.username}`);
        const profile = await response.json();
        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

// Fetch GitHub activity feed
async function fetchGitHubActivity() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_API_CONFIG.username}/events/public`, {
            headers: GITHUB_API_CONFIG.headers
        });
        const events = await response.json();
        return events.slice(0, 5); // Get last 5 events
    } catch (error) {
        console.error('Error fetching activity:', error);
        return [];
    }
}

// Update activity feed UI
function updateActivityFeed(events) {
    const activityFeed = document.getElementById('activity-feed');
    if (!activityFeed) return;

    const activityHTML = events.map(event => {
        const date = new Date(event.created_at).toLocaleDateString();
        let message = '';

        switch (event.type) {
            case 'PushEvent':
                message = `Push para ${event.repo.name}`;
                break;
            case 'CreateEvent':
                message = `Criou ${event.payload.ref_type} ${event.repo.name}`;
                break;
            case 'ForkEvent':
                message = `Fez fork de ${event.repo.name}`;
                break;
            default:
                message = `Atividade em ${event.repo.name}`;
        }

        return `
            <div class="activity-item mb-3 p-3 bg-light rounded">
                <div class="d-flex justify-content-between">
                    <strong>${message}</strong>
                    <small>${date}</small>
                </div>
            </div>
        `;
    }).join('');

    activityFeed.innerHTML = activityHTML || '<p>Sem atividade recente</p>';
}

// Updated repository filtering
function filterRepositories(repos) {
    return repos.filter(repo => {
        // Include specific repositories and Python/Jupyter projects
        return !repo.fork && (
            repo.language === 'Python' ||
            repo.language === 'Jupyter Notebook' ||
            repo.name.toLowerCase().includes('data') ||
            repo.name.toLowerCase().includes('ml') ||
            repo.name.toLowerCase().includes('ai')
        );
    });
}

// Update projects section with GitHub repos
async function updateProjectsFromGitHub() {
    const repos = await fetchGitHubRepos();
    const projectsContainer = document.getElementById('projects-container');
    
    projectsContainer.innerHTML = repos.slice(0, 6).map(repo => `
        <div class="col-md-4 mb-4">
            <div class="card project-card" data-aos="fade-up">
                <div class="card-body">
                    <h5 class="card-title">${repo.name}</h5>
                    <p class="card-text">${repo.description || 'No description available'}</p>
                    <div class="repo-stats mb-3">
                        <span class="badge bg-primary">⭐ ${repo.stargazers_count}</span>
                        <span class="badge bg-secondary">🍴 ${repo.forks_count}</span>
                        <span class="badge bg-info">${repo.language || 'N/A'}</span>
                    </div>
                    <a href="${repo.html_url}" class="btn btn-primary btn-sm" target="_blank">View Project</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Update profile section with GitHub data
async function updateProfileFromGitHub() {
    const profile = await fetchGitHubProfile();
    if (profile) {
        document.querySelector('.profile-img').src = profile.avatar_url;
        document.querySelector('.hero-section .lead').textContent = profile.bio || 'Entusiasta de Data Science & IA';
        
        const statsContainer = document.querySelector('.github-stats-container');
        statsContainer.innerHTML = `
            <div class="row text-center">
                <div class="col-md-4">
                    <h4>${profile.public_repos}</h4>
                    <p>Repositórios</p>
                </div>
                <div class="col-md-4">
                    <h4>${profile.followers}</h4>
                    <p>Seguidores</p>
                </div>
                <div class="col-md-4">
                    <h4>${profile.following}</h4>
                    <p>Seguindo</p>
                </div>
            </div>
        `;
    }
}

// Update the GitHub stats function
async function updateGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_API_CONFIG.username}`, {
            headers: GITHUB_API_CONFIG.headers
        });
        
        if (!response.ok) {
            throw new Error('Falha na solicitação da API do GitHub');
        }
        
        const data = await response.json();
        
        // Update all stats containers
        const statsContainers = document.querySelectorAll('.github-stats-container');
        statsContainers.forEach(container => {
            container.innerHTML = `
                <div class="row text-center">
                    <div class="col-md-4">
                        <h4 class="counter">${data.public_repos}</h4>
                        <p>Repositórios</p>
                    </div>
                    <div class="col-md-4">
                        <h4 class="counter">${data.followers}</h4>
                        <p>Seguidores</p>
                    </div>
                    <div class="col-md-4">
                        <h4 class="counter">${data.following}</h4>
                        <p>Seguindo</p>
                    </div>
                </div>
            `;
        });

        return data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas do GitHub:', error);
        showErrorMessage('Falha ao carregar estatísticas do GitHub');
        return null;
    }
}

// Fetch Jupyter notebooks from GitHub
async function fetchJupyterNotebooks() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_API_CONFIG.username}/repos`, {
            headers: GITHUB_API_CONFIG.headers
        });
        const repos = await response.json();
        
        // Filter for repositories containing Jupyter notebooks
        return repos.filter(repo => 
            repo.language === 'Jupyter Notebook' || 
            repo.name.toLowerCase().includes('notebook') ||
            repo.name.toLowerCase().includes('jupyter')
        );
    } catch (error) {
        console.error('Error fetching notebooks:', error);
        return [];
    }
}

// Update notebooks UI
function updateNotebooksUI(notebooks) {
    const notebooksContainer = document.getElementById('notebooks-container');
    if (!notebooksContainer) return;

    notebooksContainer.innerHTML = notebooks.map(notebook => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="notebook-card">
                <div class="card-body">
                    <span class="badge bg-info language-badge">Jupyter</span>
                    <h5 class="card-title">${notebook.name}</h5>
                    <p class="card-text">${notebook.description || 'No description available'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary btn-sm view-notebook" 
                                data-repo="${notebook.name}"
                                data-owner="${GITHUB_API_CONFIG.username}">
                            View Notebook
                        </button>
                        <a href="${notebook.html_url}" class="btn btn-outline-secondary btn-sm" target="_blank">
                            <i class="fab fa-github"></i> Source
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners for notebook viewers
    document.querySelectorAll('.view-notebook').forEach(button => {
        button.addEventListener('click', () => {
            const repo = button.dataset.repo;
            const owner = button.dataset.owner;
            showNotebook(owner, repo);
        });
    });
}

// Show notebook in viewer
function showNotebook(owner, repo) {
    const viewer = document.getElementById('notebook-viewer');
    const iframe = document.getElementById('notebook-iframe');
    
    // Use nbviewer to render the notebook
    iframe.src = `https://nbviewer.org/github/${owner}/${repo}/blob/main/notebook.ipynb`;
    viewer.classList.add('active');

    // Handle close button
    document.getElementById('close-notebook').onclick = () => {
        viewer.classList.remove('active');
        iframe.src = '';
    };
}

// Populate skills
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize animation library
        AOS.init();

        // First update GitHub stats
        await updateGitHubStats();

        // Then fetch remaining data
        const [profile, repos, events] = await Promise.all([
            fetchGitHubProfile(),
            fetchGitHubRepos(),
            fetchGitHubActivity()
        ]);

        if (profile) {
            updateProfileUI(profile);
        }

        if (repos) {
            const filteredRepos = filterRepositories(repos);
            updateRepositoriesUI(filteredRepos);
            updateLanguageStats(filteredRepos);
        }

        if (events) {
            updateActivityFeed(events);
        }

        // Update GitHub contributions graph
        const contributionsContainer = document.getElementById('github-contributions');
        if (contributionsContainer) {
            contributionsContainer.innerHTML = `
                <img src="https://ghchart.rshah.org/${GITHUB_API_CONFIG.username}" 
                     alt="GitHub Contributions" 
                     class="img-fluid"
                />
            `;
        }

    } catch (error) {
        console.error('Error initializing portfolio:', error);
        showErrorMessage('Failed to load some content. Please refresh the page.');
    }

    const skillsContainer = document.querySelector('.skills-container');
    skills.forEach(skill => {
        const badge = document.createElement('span');
        badge.className = 'skill-badge';
        badge.textContent = skill;
        skillsContainer.appendChild(badge);
    });

    // Populate projects
    const projectsContainer = document.getElementById('projects-container');
    projects.forEach(project => {
        projectsContainer.innerHTML += `
            <div class="col-md-4">
                <div class="card project-card" data-aos="fade-up">
                    <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text">${project.description}</p>
                        <div class="technologies">
                            ${project.technologies.map(tech => 
                                `<span class="badge bg-secondary">${tech}</span>`
                            ).join(' ')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // Populate blog posts
    const blogContainer = document.getElementById('blog-posts');
    blogPosts.forEach(post => {
        blogContainer.innerHTML += `
            <div class="col-md-6">
                <article class="blog-post" data-aos="fade-up">
                    <h3>${post.title}</h3>
                    <div class="date">${post.date}</div>
                    <p>${post.summary}</p>
                    <a href="#" class="btn btn-primary">Read More</a>
                </article>
            </div>
        `;
    });

    // Populate certificates
    const certGrid = document.querySelector('.cert-grid');
    certificates.forEach(cert => {
        certGrid.innerHTML += `
            <div class="cert-card" data-aos="fade-up">
                <h4>${cert.title}</h4>
                <p>Issued by: ${cert.issuer}</p>
                <p>Date: ${cert.date}</p>
                <a href="${cert.credential}" class="btn btn-sm btn-primary">View Credential</a>
            </div>
        `;
    });

    // Project filters
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterProjects(filter);
        });
    });

    // Update GitHub data
    await updateProfileFromGitHub();
    await updateProjectsFromGitHub();
    
    // Add contribution graph
    const contributionsContainer = document.getElementById('github-contributions');
    if (contributionsContainer) {
        contributionsContainer.innerHTML = `
            <img src="https://ghchart.rshah.org/${GITHUB_API_CONFIG.username}" 
                 alt="GitHub Contributions" 
                 class="img-fluid"
            />
        `;
    }

    // Fetch and display Jupyter notebooks
    const notebooks = await fetchJupyterNotebooks();
    if (notebooks.length > 0) {
        updateNotebooksUI(notebooks);
    }

    fetchGitHubData();
});

function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Example usage
console.log(add(5, 3));       // Output: 8
console.log(subtract(5, 3));  // Output: 2
console.log(multiply(5, 3));  // Output: 15
console.log(divide(5, 3));    // Output: 1.6666666666666667