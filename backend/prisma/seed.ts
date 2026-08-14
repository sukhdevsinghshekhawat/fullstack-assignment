import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a demo guest user for the seed.
  const guest = await prisma.user.upsert({
    where: { email: 'guest@taskflow.local' },
    update: {},
    create: {
      email: 'guest@taskflow.local',
      name: 'Dexter',
      isGuest: true,
    },
  });

  // Seed labels.
  const labelNames = ['Deployment', 'Design', 'Backend', 'Frontend', 'Testing', 'Security'];
  const labels = new Map<string, string>();
  for (const name of labelNames) {
    const label = await prisma.label.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    labels.set(name, label.id);
  }

  // Seed tasks distributed across statuses.
  const tasks = [
    {
      title: 'Write API Documentation',
      description: 'Create comprehensive API documentation for the task endpoints.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-09-12'),
      labels: ['Backend'],
    },
    {
      title: 'Implement Search Function',
      description: 'Add server-side search by task title.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2026-09-15'),
      labels: ['Frontend', 'Backend'],
    },
    {
      title: 'Deploy to Production',
      description: 'Deploy the latest build to the production environment.',
      status: TaskStatus.DOING,
      priority: TaskPriority.URGENT,
      dueDate: new Date('2026-08-20'),
      labels: ['Deployment'],
    },
    {
      title: 'Code Review Completed',
      description: 'Review and merge the pending pull requests.',
      status: TaskStatus.DOING,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-08-18'),
      labels: ['Backend'],
    },
    {
      title: 'Design Mockups Finalized',
      description: 'Finalize the Figma mockups for the new screens.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2026-08-10'),
      labels: ['Design'],
    },
    {
      title: 'Feature Testing Passed',
      description: 'Run the full test suite and fix any regressions.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.LOW,
      dueDate: new Date('2026-08-12'),
      labels: ['Testing'],
    },
    {
      title: 'UI Design Updated',
      description: 'Update the UI to match the latest design tokens.',
      status: TaskStatus.ON_HOLD,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2026-09-01'),
      labels: ['Design', 'Frontend'],
    },
    {
      title: 'Security Audit Scheduled',
      description: 'Schedule a security audit with the security team.',
      status: TaskStatus.ON_HOLD,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-09-05'),
      labels: ['Security'],
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createdById: guest.id,
        members: {
          create: [{ userId: guest.id }],
        },
        labels: {
          create: task.labels.map((name) => ({
            userId: guest.id,
            labelId: labels.get(name)!,
          })),
        },
      },
    });
  }

  console.log('Seed complete: 8 tasks created for guest user.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });