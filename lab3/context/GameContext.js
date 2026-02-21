import { createContext, useEffect, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Зробити 10 кліків', goal: 10, current: 0, completed: false, type: 'tap' },
    { id: '2', text: 'Зробити подвійний клік 5 разів', goal: 5, current: 0, completed: false, type: 'doubleTap' },
    { id: '3', text: 'Утримувати об\'єкт 3 секунди', goal: 1, current: 0, completed: false, type: 'longPress' },
    { id: '4', text: 'Перетягнути об\'єкт', goal: 1, current: 0, completed: false, type: 'pan' },
    { id: '5', text: 'Зробити свайп вправо', goal: 1, current: 0, completed: false, type: 'flingRight' },
    { id: '6', text: 'Зробити свайп вліво', goal: 1, current: 0, completed: false, type: 'flingLeft' },
    { id: '7', text: 'Змінити розмір об\'єкта', goal: 1, current: 0, completed: false, type: 'pinch' },
    { id: '8', text: 'Отримати 100 очок', goal: 100, current: 0, completed: false, type: 'score' },
  ]);

  const updateTaskProgress = (type, amount = 1) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.type === type && !task.completed) {
        const newCurrent = task.current + amount;
        return { 
          ...task, 
          current: newCurrent, 
          completed: newCurrent >= task.goal 
        };
      }
      return task;
    }));
  };

  useEffect(() => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.type === 'score' && !task.completed) {
        return { 
          ...task, 
          current: score, 
          completed: score >= task.goal 
        };
      }
      return task;
    }));
  }, [score]);

  return (
    <GameContext.Provider value={{ score, setScore, tasks, updateTaskProgress }}>
      {children}
    </GameContext.Provider>
  );
};