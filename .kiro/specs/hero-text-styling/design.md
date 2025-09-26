# Design Document

## Overview

This design implements styled text elements that appear after the main hero heading "Build Your Team. Build Your Project." The implementation will add "Hire Vetted Software" and "Data Engineers" in oval-shaped backgrounds with teal and green colors respectively, connected by an unstyled "&" symbol. The design maintains consistency with the existing Framer Motion animations and Tailwind CSS styling approach.

## Architecture

The feature will be implemented as an additional motion.div element within the existing hero section, positioned directly after the main h1 heading. It will leverage the existing heroInView state and animation patterns to ensure seamless integration with the current animation sequence.

### Component Structure
```
Hero Section
├── Main Heading (existing)
├── Styled Text Elements (new)
│   ├── "Hire Vetted Software" (teal oval)
│   ├── "&" (unstyled)
│   └── "Data Engineers" (green oval)
└── Description Paragraph (existing)
```

## Components and Interfaces

### Styled Text Component
The styled text elements will be implemented as inline elements within a flex container:

- **Container**: `motion.div` with flex layout and center alignment
- **Text Elements**: Individual `span` elements with oval background styling
- **Separator**: Plain text "&" without background styling

### Animation Integration
- Uses existing `heroInView` state from react-intersection-observer
- Follows the same animation pattern as other hero elements
- Staggered animation delay to appear after the main heading

## Data Models

### Styling Configuration
```typescript
interface StyledTextConfig {
  text: string;
  bgColor: string;
  textColor: string;
  hasBackground: boolean;
}

const textElements: StyledTextConfig[] = [
  {
    text: "Hire Vetted Software",
    bgColor: "bg-teal-500",
    textColor: "text-white",
    hasBackground: true
  },
  {
    text: "&",
    bgColor: "",
    textColor: "text-gray-900",
    hasBackground: false
  },
  {
    text: "Data Engineers",
    bgColor: "bg-green-500",
    textColor: "text-white", 
    hasBackground: true
  }
];
```

## Styling Specifications

### Color Scheme
- **Teal Background**: `bg-teal-500` (consistent with existing teal theme)
- **Green Background**: `bg-green-500` (complementary green shade)
- **Text Color**: `text-white` for oval backgrounds
- **Separator Color**: `text-gray-900` (matches main text color)

### Typography
- **Font Size**: `text-2xl lg:text-3xl` (responsive sizing)
- **Font Weight**: `font-semibold` (medium emphasis)
- **Font Family**: Inherits from parent (system font stack)

### Layout and Spacing
- **Container**: Flex layout with center alignment and gap spacing
- **Oval Shape**: Achieved with high border-radius (`rounded-full`)
- **Padding**: `px-6 py-3` for oval backgrounds
- **Margin**: `mb-6` bottom margin to separate from description
- **Gap**: `gap-3` between elements

### Responsive Behavior
- **Mobile**: Smaller text size (`text-2xl`), maintains center alignment
- **Desktop**: Larger text size (`lg:text-3xl`), follows hero section alignment
- **Flex Wrap**: Elements wrap on very small screens if needed

## Animation Design

### Motion Configuration
```typescript
const styledTextAnimation = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: heroInView ? { 
    opacity: 1, 
    y: 0, 
    scale: 1 
  } : { 
    opacity: 0, 
    y: 30, 
    scale: 0.95 
  },
  transition: { 
    delay: 0.4, 
    duration: 0.8, 
    ease: "easeOut" 
  }
};
```

### Animation Sequence
1. Main heading animates in (delay: 0)
2. Styled text elements animate in (delay: 0.4s)
3. Description paragraph animates in (delay: 0.2s - existing)

## Error Handling

### Graceful Degradation
- If Framer Motion fails to load, elements display without animation
- CSS fallbacks ensure proper styling without JavaScript
- Responsive classes provide consistent layout across devices

### Accessibility Considerations
- Maintains proper color contrast ratios (4.5:1 minimum)
- Text remains readable if custom fonts fail to load
- Semantic HTML structure preserved for screen readers

## Testing Strategy

### Visual Testing
- Cross-browser compatibility testing (Chrome, Firefox, Safari, Edge)
- Responsive design testing across device sizes
- Color contrast validation for accessibility compliance

### Animation Testing
- Verify smooth animation timing and easing
- Test intersection observer functionality
- Validate animation performance on lower-end devices

### Integration Testing
- Ensure no layout shifts or conflicts with existing elements
- Verify proper spacing and alignment with surrounding content
- Test animation sequence coordination with other hero elements

## Implementation Notes

### CSS Classes Structure
```css
/* Container */
.styled-text-container {
  @apply flex items-center justify-center lg:justify-start gap-3 mb-6;
}

/* Oval backgrounds */
.text-oval {
  @apply px-6 py-3 rounded-full font-semibold;
}

/* Teal variant */
.text-oval-teal {
  @apply bg-teal-500 text-white;
}

/* Green variant */
.text-oval-green {
  @apply bg-green-500 text-white;
}
```

### Performance Considerations
- Minimal additional CSS classes to avoid bundle size increase
- Reuses existing Tailwind utilities where possible
- No additional JavaScript dependencies required