package com.horserace.config;

import com.horserace.entity.*;
import com.horserace.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HorseRepository horseRepository;
    private final JockeyRepository jockeyRepository;
    private final RaceRepository raceRepository;
    private final RegistrationRepository registrationRepository;
    private final ResultRepository resultRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository,
                      HorseRepository horseRepository,
                      JockeyRepository jockeyRepository,
                      RaceRepository raceRepository,
                      RegistrationRepository registrationRepository,
                      ResultRepository resultRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.horseRepository = horseRepository;
        this.jockeyRepository = jockeyRepository;
        this.raceRepository = raceRepository;
        this.registrationRepository = registrationRepository;
        this.resultRepository = resultRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Users if empty
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("System Administrator")
                    .email("admin@horserace.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            User official = User.builder()
                    .name("Official Chief Referee")
                    .email("official@horserace.com")
                    .password(passwordEncoder.encode("official123"))
                    .role(Role.RACE_OFFICIAL)
                    .build();

            User viewer = User.builder()
                    .name("Public Viewer User")
                    .email("viewer@horserace.com")
                    .password(passwordEncoder.encode("viewer123"))
                    .role(Role.VIEWER)
                    .build();

            userRepository.save(admin);
            userRepository.save(official);
            userRepository.save(viewer);
        }

        // Seed Horses if empty
        if (horseRepository.count() == 0) {
            Horse h1 = horseRepository.save(Horse.builder().name("Thunder").breed("Arabian").age(5).gender("Male").status("ACTIVE").build());
            Horse h2 = horseRepository.save(Horse.builder().name("Storm").breed("Thoroughbred").age(4).gender("Female").status("ACTIVE").build());
            Horse h3 = horseRepository.save(Horse.builder().name("Lightning").breed("Quarter Horse").age(6).gender("Male").status("ACTIVE").build());
            Horse h4 = horseRepository.save(Horse.builder().name("Blaze").breed("Thoroughbred").age(3).gender("Male").status("ACTIVE").build());
            Horse h5 = horseRepository.save(Horse.builder().name("Champion").breed("Arabian").age(5).gender("Male").status("ACTIVE").build());
            Horse h6 = horseRepository.save(Horse.builder().name("Royal Star").breed("Appaloosa").age(4).gender("Female").status("ACTIVE").build());
            Horse h7 = horseRepository.save(Horse.builder().name("Silver Arrow").breed("Thoroughbred").age(6).gender("Male").status("ACTIVE").build());
            Horse h8 = horseRepository.save(Horse.builder().name("Dark Knight").breed("Friesian").age(7).gender("Male").status("ACTIVE").build());
            Horse h9 = horseRepository.save(Horse.builder().name("Golden Crest").breed("Thoroughbred").age(4).gender("Female").status("ACTIVE").build());
            Horse h10 = horseRepository.save(Horse.builder().name("Pegasus").breed("Arabian").age(5).gender("Male").status("INACTIVE").build());

            // Seed Jockeys
            Jockey j1 = jockeyRepository.save(Jockey.builder().name("Rahul Sharma").age(28).experience(8).status("ACTIVE").build());
            Jockey j2 = jockeyRepository.save(Jockey.builder().name("Amit Verma").age(32).experience(12).status("ACTIVE").build());
            Jockey j3 = jockeyRepository.save(Jockey.builder().name("Vikram Singh").age(25).experience(5).status("ACTIVE").build());
            Jockey j4 = jockeyRepository.save(Jockey.builder().name("Rohan Mehta").age(30).experience(9).status("ACTIVE").build());
            Jockey j5 = jockeyRepository.save(Jockey.builder().name("Arjun Kapoor").age(27).experience(6).status("ACTIVE").build());
            Jockey j6 = jockeyRepository.save(Jockey.builder().name("Karan Patel").age(35).experience(14).status("ACTIVE").build());

            // Seed Races
            Race r1 = raceRepository.save(Race.builder().raceName("Pune Derby 2026").raceDate(LocalDate.of(2026, 8, 15)).raceTime(LocalTime.of(15, 30)).location("Pune Racecourse").distance("1600m").status(RaceStatus.COMPLETED).build());
            Race r2 = raceRepository.save(Race.builder().raceName("Mumbai Classic").raceDate(LocalDate.of(2026, 8, 28)).raceTime(LocalTime.of(16, 0)).location("Mahalaxmi Racecourse").distance("2000m").status(RaceStatus.COMPLETED).build());
            Race r3 = raceRepository.save(Race.builder().raceName("Delhi Cup").raceDate(LocalDate.now()).raceTime(LocalTime.of(14, 0)).location("Delhi Race Club").distance("1400m").status(RaceStatus.ONGOING).build());
            Race r4 = raceRepository.save(Race.builder().raceName("Bangalore Championship").raceDate(LocalDate.now().plusDays(10)).raceTime(LocalTime.of(15, 0)).location("Bangalore Turf Club").distance("1800m").status(RaceStatus.SCHEDULED).build());
            Race r5 = raceRepository.save(Race.builder().raceName("Maharashtra Trophy").raceDate(LocalDate.now().plusDays(25)).raceTime(LocalTime.of(16, 30)).location("Pune Racecourse").distance("2400m").status(RaceStatus.SCHEDULED).build());

            // Seed Registrations for Race 1 (Pune Derby)
            registrationRepository.save(Registration.builder().race(r1).horse(h1).jockey(j1).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r1).horse(h2).jockey(j2).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r1).horse(h3).jockey(j3).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r1).horse(h4).jockey(j4).status("REGISTERED").build());

            // Seed Registrations for Race 2 (Mumbai Classic)
            registrationRepository.save(Registration.builder().race(r2).horse(h5).jockey(j5).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r2).horse(h6).jockey(j6).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r2).horse(h1).jockey(j2).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r2).horse(h7).jockey(j1).status("REGISTERED").build());

            // Seed Registrations for Race 3 & 4
            registrationRepository.save(Registration.builder().race(r3).horse(h2).jockey(j3).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r3).horse(h8).jockey(j4).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r4).horse(h4).jockey(j1).status("REGISTERED").build());
            registrationRepository.save(Registration.builder().race(r4).horse(h9).jockey(j2).status("REGISTERED").build());

            // Seed Results for Race 1
            resultRepository.save(Result.builder().race(r1).horse(h1).jockey(j1).position(1).finishTime("1:36.42").build());
            resultRepository.save(Result.builder().race(r1).horse(h3).jockey(j3).position(2).finishTime("1:37.15").build());
            resultRepository.save(Result.builder().race(r1).horse(h2).jockey(j2).position(3).finishTime("1:37.89").build());
            resultRepository.save(Result.builder().race(r1).horse(h4).jockey(j4).position(4).finishTime("1:38.50").build());

            // Seed Results for Race 2
            resultRepository.save(Result.builder().race(r2).horse(h5).jockey(j5).position(1).finishTime("2:02.10").build());
            resultRepository.save(Result.builder().race(r2).horse(h1).jockey(j2).position(2).finishTime("2:02.85").build());
            resultRepository.save(Result.builder().race(r2).horse(h7).jockey(j1).position(3).finishTime("2:03.40").build());
            resultRepository.save(Result.builder().race(r2).horse(h6).jockey(j6).position(4).finishTime("2:04.12").build());
        }
    }
}
