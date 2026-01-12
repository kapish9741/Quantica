# How to Add Multiple Teams to About Page

The About page now supports multiple teams with different categories. Here's how to add new teams:

## Structure

The page has two main team sections:

1. **Core Team Section** - Shows the main leadership/core team
2. **Additional Teams Section** - Shows multiple teams with different headings

## Adding a New Team Category

To add a new team (e.g., Marketing Team, Technical Team, Design Team), edit the `additionalTeams` array in `/src/pages/About.tsx`:

```typescript
const additionalTeams = [
  {
    title: "Marketing Team", // Main heading
    subtitle: "Creative Minds", // Subheading
    members: [
      {
        name: "John Doe",
        role: "Social Media Manager",
        image: "https://your-image-url.com/photo.jpg",
        linkedin: "https://www.linkedin.com/in/johndoe/",
        email: "john.doe@example.com",
      },
      // Add more members here...
    ],
  },
  {
    title: "Technical Team",
    subtitle: "Code Warriors",
    members: [
      // Add tech team members here
    ],
  },
  // Add more teams as needed
];
```

## Member Object Structure

Each team member should have:

- `name`: Full name of the person
- `role`: Their position/title
- `image`: URL to their profile image (recommended: 800x800px or higher)
- `linkedin`: LinkedIn profile URL (optional, use "#" if none)
- `email`: Contact email

## Features

- **Automatic Display**: Teams with members will automatically appear
- **Empty Teams Hidden**: Teams with no members won't be shown
- **Responsive Grid**: Automatically adjusts for mobile, tablet, and desktop
- **Smooth Animations**: Each team and member has staggered fade-in animations
- **Hover Effects**: Images change from grayscale to color on hover
- **Social Links**: Email and LinkedIn icons for each member

## Example: Adding a Full Team

```typescript
{
  title: "Outreach Team",
  subtitle: "Community Builders",
  members: [
    {
      name: "Alice Johnson",
      role: "Outreach Coordinator",
      image: "https://example.com/alice.jpg",
      linkedin: "https://www.linkedin.com/in/alicejohnson/",
      email: "alice@quantica.com",
    },
    {
      name: "Bob Smith",
      role: "Community Manager",
      image: "https://example.com/bob.jpg",
      linkedin: "https://www.linkedin.com/in/bobsmith/",
      email: "bob@quantica.com",
    },
  ],
},
```

## Tips

1. **Image Quality**: Use high-quality, professional photos
2. **Consistency**: Keep image dimensions consistent for best results
3. **Order**: Teams appear in the order they're defined in the array
4. **Spacing**: Each team category is automatically spaced with proper margins
5. **Grid Layout**: Displays 1 column on mobile, 2 on tablet, 4 on desktop
