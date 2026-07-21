import { useRef, useEffect } from "react";
import styles from "./ActivityHeatmap.module.css";

export function ActivityHeatmap({ progress }) {
  const weeksRef = useRef(null);

  useEffect(() => {
    if (weeksRef.current) {
      weeksRef.current.scrollLeft = weeksRef.current.scrollWidth;
    }
  }, []);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  function getDates() {
    const dates = [];
    const current = new Date(startDate);
    while (current <= today) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  function getActivityMap() {
    const map = {};
    progress.forEach((p) => {
      const date = new Date(p.last_studied_at).toISOString().split("T")[0];
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  }

  function getIntensity(count) {
    if (!count) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count >= 3) return 3;
    return 0;
  }

  const dates = getDates();
  const activityMap = getActivityMap();

  const weeks = [];
  let currentWeek = [];
  dates.forEach((date, index) => {
    if (index === 0) {
      for (let i = 0; i < date.getDay(); i++) {
        currentWeek.push(null);
      }
    }
    currentWeek.push(date);
    if (date.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.find((d) => d !== null);
    if (firstDay) {
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          index: i,
          label: firstDay.toLocaleString("default", { month: "short" }),
        });
        lastMonth = month;
      }
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Study Activity</h2>
        <span className={styles.subtitle}>Last 12 Months</span>
      </div>

      <div className={styles.heatmap} ref={weeksRef}>
        <div className={styles.dayLabels}>
          {dayLabels.map((day, i) => (
            <span
              key={day}
              className={`${styles.dayLabel} ${i % 2 === 0 ? styles.dayLabelVisible : ""}`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className={styles.weeksContainer}>
          <div className={styles.monthLabels}>
            {weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.index === i);
              return (
                <span key={i} className={styles.monthLabel}>
                  {label ? label.label : ""}
                </span>
              );
            })}
          </div>

          <div className={styles.weeks}>
            {weeks.map((week, wi) => (
              <div key={wi} className={styles.week}>
                {Array.from({ length: 7 }).map((_, di) => {
                  const date = week[di];
                  if (!date) return <div key={di} className={styles.dayEmpty} />;
                  const dateStr = date.toISOString().split("T")[0];
                  const count = activityMap[dateStr] || 0;
                  const intensity = getIntensity(count);
                  return (
                    <div
                      key={di}
                      className={`${styles.day} ${styles[`intensity${intensity}`]}`}
                      title={`${dateStr}: ${count} chapter${count !== 1 ? "s" : ""} studied`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        <div className={`${styles.legendBox} ${styles.intensity0}`} />
        <div className={`${styles.legendBox} ${styles.intensity1}`} />
        <div className={`${styles.legendBox} ${styles.intensity2}`} />
        <div className={`${styles.legendBox} ${styles.intensity3}`} />
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}
