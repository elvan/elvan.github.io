# Elvan Hidayat - Portfolio Website

A modern, responsive personal portfolio website showcasing my skills, experience, and projects as a Software Developer.

🔗 **Live Site**: [elvan.github.io](https://elvan.github.io)

## ✨ Features

- **🎨 Modern Design**: Clean, professional layout with smooth animations
- **📱 Fully Responsive**: Optimized for all devices and screen sizes
- **🌗 Dark/Light Theme**: Toggle between themes with persistent storage
- **⚡ Performance Optimized**: Lazy loading, efficient animations, minimal dependencies
- **♿ Accessible**: ARIA labels, semantic HTML, keyboard navigation
- **🎯 Interactive**: Typing animation, project filtering, scroll animations

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, Custom Properties, Animations
- **Icons**: Font Awesome 6.0.0
- **Fonts**: Google Fonts (Poppins)
- **Deployment**: GitHub Pages

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/elvan/elvan.github.io.git
   cd elvan.github.io
   ```

2. **Serve locally** (choose one method)
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Direct File Access
Simply open `index.html` in your browser for basic testing.

## 📁 Project Structure

```
elvan.github.io/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎯 Sections

- **🏠 Home**: Hero section with typing animation and social links
- **👨‍💻 About**: Personal introduction and profile image
- **💼 Experience**: Professional work history with timeline
- **🛠️ Skills**: Technical skills with animated progress bars
- **🚀 Projects**: Portfolio projects with filtering functionality
- **📞 Contact**: Contact information and social links

## 🔧 Development

### Adding New Projects

1. Add project data to the `.projects-grid` in `index.html`
2. Include project image, title, description, and tech tags
3. Set `data-category` for filtering (react, vue, angular, etc.)

### Customizing Themes

- Light theme: Modify `:root` CSS variables in `styles.css`
- Dark theme: Update `[data-theme="dark"]` variables
- Add new theme: Create new data attribute selector

### Adding Animations

- Use Intersection Observer API for scroll-based animations
- Follow existing animation patterns in `script.js`
- Maintain performance with `transform` and `opacity` properties

## 🌟 Key Features Explained

### Theme Switching
```javascript
// Automatic theme persistence with localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

### Project Filtering
```javascript
// Dynamic filtering with smooth animations
const filterProjects = (filter) => {
  projectCards.forEach((card) => {
    const category = card.dataset.category;
    const shouldShow = filter === 'all' || category === filter;
    // Animate show/hide with CSS transitions
  });
};
```

### Performance Optimization
```javascript
// Lazy loading images with Intersection Observer
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
    }
  });
});
```

## 📱 Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Mobile browsers

## 🚀 Deployment

The site is automatically deployed via GitHub Pages:

1. **Push to main branch**
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

2. **GitHub Pages** automatically builds and deploys the site
3. **Live in minutes** at `https://elvan.github.io`

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔄 Recent Updates

- ✅ Added dark/light theme toggle
- ✅ Implemented lazy loading for images
- ✅ Enhanced mobile responsiveness
- ✅ Added skill progress animations
- ✅ Improved accessibility features

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: [elvan.hidayat@gmail.com](mailto:elvan.hidayat@gmail.com)
- **GitHub**: [@elvan](https://github.com/elvan)
- **LinkedIn**: [elvan-hidayat](https://linkedin.com/in/elvan-hidayat)

---

⭐ **If you found this portfolio helpful, please consider giving it a star!**
