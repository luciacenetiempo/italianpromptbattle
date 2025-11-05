'use client';

import React, { forwardRef } from 'react';
import FormAttendee from './FormAttendee';
import styles from './AttendeeSection.module.css';

const AttendeeSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} className={styles.attendeeSection}>
      <div className={styles.container}>
        <FormAttendee inlineFields={true} />
      </div>
    </section>
  );
});

AttendeeSection.displayName = 'AttendeeSection';

export default AttendeeSection;

