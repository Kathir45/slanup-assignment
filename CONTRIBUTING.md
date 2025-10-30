# Contributing Guide

Thank you for your interest in improving Mini Event Finder! This guide will help you understand the codebase and contribute effectively.

## Project Overview

This is a full-stack event discovery application with:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Storage**: In-memory (for demo purposes)

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd mini-event-finder

# Install dependencies
npm install

# Start development servers
npm run dev
```

## Code Structure

### Frontend (`src/`)
```
src/
├── components/          # React components
│   ├── EventCard.tsx   # Individual event card
│   ├── EventModal.tsx  # Event detail modal
│   └── CreateEventModal.tsx  # Create event form
├── hooks/              # Custom React hooks
│   └── useGeolocation.ts  # Geolocation hook
├── services/           # API communication
│   └── eventService.ts # Event API calls
├── types/              # TypeScript types
│   └── database.types.ts  # Data models
├── utils/              # Utility functions
│   └── geolocation.ts  # Distance calculations
├── App.tsx             # Main component
└── main.tsx            # Entry point
```

### Backend (`server/`)
```
server/
├── index.ts            # Express server & routes
└── tsconfig.json       # Backend TS config
```

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Keep components focused and small

### 3. Test Your Changes
```bash
# Start the app
npm run dev

# Check TypeScript
npm run typecheck

# Lint code
npm run lint
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit messages:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript
- Use explicit types, avoid `any`
- Define interfaces for all data structures
- Use type imports: `import type { Type } from '...'`

### React
- Use functional components with hooks
- Keep components under 200 lines
- Extract custom hooks for reusable logic
- Use proper prop typing

### Styling
- Use Tailwind utility classes
- Follow the existing design system
- Ensure responsive design (mobile-first)
- Test on multiple screen sizes

### API
- Follow REST conventions
- Return appropriate status codes
- Include error messages in responses
- Validate input data

## Adding New Features

### Frontend Component
1. Create component file in `src/components/`
2. Define prop types with TypeScript
3. Use Tailwind for styling
4. Import and use in parent component

Example:
```typescript
interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500">
      {title}
    </button>
  );
}
```

### Backend Endpoint
1. Add route in `server/index.ts`
2. Implement handler function
3. Add validation
4. Update API documentation

Example:
```typescript
app.get('/api/my-endpoint', (req: Request, res: Response) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});
```

### Custom Hook
1. Create file in `src/hooks/`
2. Start with `use` prefix
3. Return values and functions
4. Handle cleanup

Example:
```typescript
export function useMyHook() {
  const [value, setValue] = useState(null);

  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);

  return { value, setValue };
}
```

## Common Tasks

### Add a New Event Field
1. Update `Event` interface in `src/types/database.types.ts`
2. Update event creation in `server/index.ts`
3. Update form in `CreateEventModal.tsx`
4. Update display in `EventCard.tsx` and `EventModal.tsx`

### Add API Filter
1. Add query parameter handling in `server/index.ts`
2. Update `getAllEvents()` in `src/services/eventService.ts`
3. Add UI filter in `App.tsx`

### Add Database
1. Install database package (e.g., `pg`, `mongodb`, `prisma`)
2. Replace in-memory array in `server/index.ts`
3. Add connection configuration
4. Update CRUD operations

## Testing

### Manual Testing Checklist
- [ ] Create event works
- [ ] Event list displays correctly
- [ ] Event details open
- [ ] Join/leave event works
- [ ] Search works
- [ ] Filter works
- [ ] Distance sorting works
- [ ] Loading states show
- [ ] Errors display properly
- [ ] Responsive on mobile

### API Testing
Use the commands in `API_TESTING.md` to test endpoints.

## Debugging Tips

### Frontend Issues
- Check browser console for errors
- Use React DevTools
- Add console.logs in components
- Check network tab for API calls

### Backend Issues
- Check terminal output
- Add console.logs in routes
- Test endpoints with curl/Postman
- Check request/response data

### Common Issues
1. **CORS errors** - Check CORS configuration in `server/index.ts`
2. **Port conflicts** - Change port in config files
3. **Type errors** - Run `npm run typecheck`
4. **Build errors** - Clear `dist` folder and rebuild

## Performance Tips

- Use `useMemo` for expensive calculations
- Use `useCallback` for function props
- Lazy load components if needed
- Optimize images and assets
- Minimize API calls

## Security Considerations

- Validate all user input
- Sanitize data before storage
- Use HTTPS in production
- Implement rate limiting
- Add authentication for sensitive operations

## Documentation

When adding features:
- Update README.md if setup changes
- Add JSDoc comments to complex functions
- Update API_TESTING.md for new endpoints
- Update FEATURES.md checklist

## Need Help?

- Check existing documentation
- Review similar components
- Look at commit history for examples
- Ask questions in issues/discussions

## Resources

### React
- [React Documentation](https://react.dev)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

### Express
- [Express Documentation](https://expressjs.com)
- [REST API Design Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

## License

This project is open source and available under the MIT License.

---

Thank you for contributing! 🎉
