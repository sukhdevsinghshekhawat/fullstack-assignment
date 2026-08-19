describe('ProjectsController', () => {
  it('should exist and be importable', async () => {
    const mod = await import('./projects.controller');
    expect(mod.ProjectsController).toBeDefined();
  });
});
