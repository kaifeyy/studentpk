# CampusConnect Pakistan - Design Guidelines

## Design Approach
**Reference-Based Hybrid Approach**: Blend Twitter's social engagement, Google Classroom's academic structure, and Discord's community feel into a unified Pakistani student ecosystem. The design should feel youthful, modern, and professional simultaneously.

## Core Design Principles
1. **Academic Professionalism with Social Energy**: Balance formal educational features with engaging social interactions
2. **Cultural Relevance**: Design must resonate with Pakistani students while maintaining modern global standards
3. **Mobile-First Excellence**: Every element optimized for thumb-friendly mobile interaction
4. **Dual-Role Clarity**: Clear visual distinction between Student and Admin experiences

## Typography
- **Font Family**: Poppins (primary) or Inter (alternative) - rounded, friendly sans-serif
- **Hierarchy**:
  - Headlines: Poppins SemiBold, 24-28px
  - Subheadings: Poppins Medium, 18-20px
  - Body: Poppins Regular, 14-16px
  - Captions: Poppins Regular, 12-14px
- **Bilingual Support**: Equal weight to English and Urdu text with seamless toggle

## Layout System
- **Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16 (p-2, m-4, gap-6, etc.)
- **Container**: max-w-md for mobile screens, full-width with safe area padding
- **Card Radius**: rounded-2xl (16px) consistently throughout
- **Grid System**: Single column for mobile with strategic 2-column layouts for comparison views

## Component Library

### Navigation
- **Bottom Tab Bar**: Fixed, 4 icons (Home 🏠, Notes 📚, School 🏫, Profile 👤)
- **Floating Action Button**: Prominent "+" for creating posts/announcements
- **Top App Bar**: Clean with logo/title, search icon, notification bell

### Cards & Containers
- **Feed Post Cards**: Soft shadows (shadow-md), rounded corners, white/dark background
- **Subject Cards**: Grid layout, icon + label, subtle gradient overlays
- **Announcement Cards**: School badge, timestamp, expandable content
- **Resource Cards**: Thumbnail preview, download count, verified badge

### Forms & Inputs
- **Input Fields**: Rounded borders, clear labels above, helper text below
- **Buttons**: 
  - Primary: Solid background (#1976D2), white text, rounded-full
  - Secondary: Border style, transparent fill
  - Icon Buttons: Circular, minimal touch target 48px
- **Switches/Toggles**: Modern rounded pill style for language/theme switching

### Feed Elements
- **Post Structure**: Avatar (left) + Name/School badge + Timestamp (top) + Content + Actions (like/comment/share)
- **Thread Replies**: Indented with connecting lines, nested maximum 2 levels
- **Hashtag Display**: Tappable chips with accent color
- **Media Embeds**: Full-width within card, rounded corners maintained

### Timetable Components
- **Weekly Grid**: Days as columns, periods as rows, color-coded by subject
- **Class Cell**: Subject name, teacher name (smaller), time, "Join" button for online classes
- **Time Indicators**: Left column showing period timing

### Admin Dashboard
- **Stats Cards**: Large numbers, icon, description, arranged in 2-column grid
- **Action Tiles**: Icon + label, tap to navigate to management screens
- **Quick Create Panel**: Floating panel with shortcuts to announcement/timetable/upload

## Visual Treatment

### Color Strategy
- **Primary Blue**: #1976D2 (trust, academia)
- **Secondary Green**: #4CAF50 (growth, success)
- **Background**: 
  - Light: #F5F7FA
  - Dark: #121212
  - Card: #FFFFFF / #1E1E1E
- **Accents**: #E0F7FA (light blue tint for highlights)
- **Status Colors**: Success (#4CAF50), Warning (#FFC107), Error (#F44336)

### Gradients
- **Subtle Card Overlays**: Linear gradient from transparent to 10% primary color
- **Header Backgrounds**: Gentle blue-to-green gradient for onboarding/hero sections
- **Button Hovers**: Slight lightening/darkening on interaction

### Shadows & Depth
- **Cards**: shadow-md (0 4px 6px rgba(0,0,0,0.1))
- **Floating Elements**: shadow-lg (0 10px 15px rgba(0,0,0,0.15))
- **Active States**: shadow-sm (subtle reduction on press)

## Iconography
- **Style**: Lucide or Feather icon set - simple, consistent line weight
- **Size**: 20-24px standard, 32px for feature icons
- **Color**: Match text color or use primary/secondary for emphasis

## Micro-Interactions
- **Card Slide-ins**: Gentle upward animation on load (staggered for lists)
- **Button Ripples**: Material-style touch feedback
- **Like Animation**: Heart fill with scale bounce
- **Pull-to-Refresh**: Custom loading spinner with school colors
- **Tab Switching**: Smooth horizontal swipe with indicator slide

## Images & Media

### Hero/Onboarding
- **Onboarding Screens**: Vibrant illustrations of Pakistani students collaborating, studying, using devices
- **Login Screen**: Abstract academic pattern background with logo centered

### Profile & Content
- **Avatars**: Circular, default gradient backgrounds with initials if no photo
- **School Logos**: Square with rounded corners, prominent display
- **Note Thumbnails**: PDF icon or document preview, consistent sizing

### Feed Media
- **Post Images**: Full-width within card constraints, aspect ratio maintained
- **Video Thumbnails**: Play button overlay, duration badge

## Screen-Specific Guidelines

### Onboarding Flow
- Large logo/tagline at top third
- Two prominent card-style buttons: "Join as Student" / "Join as School Admin"
- Illustrations filling negative space

### Home Feed
- Pull-to-refresh enabled
- Filter tabs (School/Public/Trending) below app bar
- Infinite scroll with loading indicator
- Empty state: Friendly illustration + "No posts yet" message

### Notes Section
- Grid of subject cards (2 columns on mobile)
- Search bar prominent at top
- Filter chips: Class, Board, Type
- Download indicator (icon changes when downloaded)

### School Dashboard (Student View)
- Top section: School banner/logo
- Quick access cards: Announcements, Timetable, Today's Classes
- Recent updates list below

### Admin Panel
- Overview stats at top (4-card grid)
- Management tiles below (larger, icon-driven)
- Consistent spacing between sections

### Profile
- Cover photo area (gradient if no image)
- Avatar overlapping cover (circular, bordered)
- Name, school badge, bio centered
- Tab navigation for Posts/Notes/Groups
- Edit button (pencil icon) top-right

## Accessibility & Localization
- Touch targets minimum 48x48px
- High contrast mode support
- RTL layout support for Urdu (automatic flip)
- Language toggle prominent in settings/profile

## Performance Considerations
- Lazy load images in feed
- Skeleton screens during loading
- Cached content for offline viewing (timetable, downloaded notes)
- Optimistic UI updates for likes/comments