import React from "react";
import Container from "../components/common/Container";
import image from "/images/about.png";

const About = () => {
  return (
    <Container>
      <div className="grid gap-4 md:grid-cols-2 dark:text-slate-50">
        <div className="flex flex-col items-center justify-center">
          <div>
            <h1 className="font-medium">
              Empower Your Fitness Journey – Track, Compete, Succeed
            </h1>
            <p>
              At Fitrack, we believe that fitness is more than just a goal—it’s
              a lifestyle. Our Fitness Challenge Tracking App is designed to
              keep you motivated, accountable, and engaged every step of the
              way. Whether you're competing with friends, setting personal
              milestones, or tracking your progress with real-time analytics, we
              provide the tools you need to push your limits and celebrate your
              victories. With interactive challenges, detailed insights, and a
              supportive community, we make fitness fun, rewarding, and
              effective. Join us and take your fitness journey to the next leve
            </p>
          </div>
        </div>
        <div className="rounded-2xl">
          <img src={image} alt="fitness peop;le smiling" />
        </div>
      </div>
    </Container>
  );
};

export default About;
