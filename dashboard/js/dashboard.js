class Dashboard {
  constructor() {
    this.tasksApiUrl = 'https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/tasks';
    this.tasks = [];
    this.progressChart = null;
    this.responsibleChart = null;

    // Referencias al DOM
    this.totalTasksEl = document.getElementById('totalTasksCount');
    this.completedTasksEl = document.getElementById('completedTasksCount');
    this.inProgressTasksEl = document.getElementById('inProgressTasksCount');
  }

  async fetchTasks() {
    try {
      const response = await fetch(this.tasksApiUrl);
      if (!response.ok) throw new Error('Error al cargar las tareas');
      this.tasks = await response.json();
      return true;
    } catch (error) {
      console.error('Error en fetchTasks:', error);
      return false;
    }
  }

  renderStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => Boolean(task.state)).length;
    const inProgress = total - completed;

    this.totalTasksEl.textContent = total;
    this.completedTasksEl.textContent = completed;
    this.inProgressTasksEl.textContent = inProgress;

    this.renderProgressChart(completed, inProgress);
    this.renderTasksByResponsibleChart();
  }

  renderProgressChart(completed, inProgress) {
    const canvas = document.getElementById('tasksProgressChart');
    if (!canvas) return;

    if (this.progressChart) this.progressChart.destroy();

    const ctx = canvas.getContext('2d');
    this.progressChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completadas', 'Pendientes'],
        datasets: [{
          data: [completed, inProgress],
          backgroundColor: ['#4caf50', '#ff9800'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Progreso General de Tareas'
          }
        }
      }
    });
  }

  renderTasksByResponsibleChart() {
    const canvas = document.getElementById('tasksByResponsibleChart');
    if (!canvas) return;

    if (this.responsibleChart) this.responsibleChart.destroy();

    const taskCounts = this.tasks.reduce((acc, task) => {
      const name = task.responsible || 'Sin responsable';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(taskCounts);
    const data = Object.values(taskCounts);

    const ctx = canvas.getContext('2d');
    this.responsibleChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Número de Tareas',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Tareas Asignadas por Responsable'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
}

// Evento principal: inicializa el dashboard cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async () => {
  const dashboard = new Dashboard();
  const success = await dashboard.fetchTasks();
  if (success) {
    dashboard.renderStats();
  } else {
    const chartsContainer = document.querySelector('.dashboard-charts');
    if (chartsContainer) {
      chartsContainer.innerHTML = '<p class="error">No se pudieron cargar las estadísticas.</p>';
    }
  }
});
