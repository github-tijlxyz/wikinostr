export function formatDate(unixtimestamp: number) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const date = new Date(unixtimestamp * 1000);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
}

const generatedNumbers: Set<number> = new Set();

export function generateRandomNumber(): number {
  let randomNumber: number;

  do {
    randomNumber = Math.floor(Math.random() * 1000000);
  } while (generatedNumbers.has(randomNumber));

  generatedNumbers.add(randomNumber);
  return randomNumber;
}

export function scrollTabIntoView(id: string) {
  setTimeout(() => {
    const elements = document.querySelectorAll(`[id^="wikitab-v0-${id}"]`);
    if (!elements[0]) return;
    elements[0].scrollIntoView({
      behavior: 'smooth',
      inline: 'start'
    });
  }, 1);
}
