#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, log, Env, Symbol, String, symbol_short};

// Tracks aggregate stats across all habits on the platform
#[contracttype]
#[derive(Clone)]
pub struct HabitStats {
    pub total: u64,      // Total habits ever created
    pub active: u64,     // Currently active (not completed/abandoned)
    pub completed: u64,  // Habits marked as fully completed
    pub abandoned: u64,  // Habits marked abandoned by user
}

// Symbol key for the global HabitStats object in storage
const ALL_HABIT: Symbol = symbol_short!("ALL_HABIT");  // max 9 chars

// Maps a habit's unique_id to its Habit struct
#[contracttype]
pub enum HabitBook {
    Habit(u64),
}

// Counter key for generating unique habit IDs
const COUNT_HABIT: Symbol = symbol_short!("C_HABIT");

// Core data structure representing a single on-chain habit
#[contracttype]
#[derive(Clone)]
pub struct Habit {
    pub habit_id: u64,       // Unique identifier
    pub title: String,       // Short habit title
    pub descrip: String,     // Description / goal of the habit
    pub frequency: u64,      // How many times user aims to check in (target streak)
    pub checkins: u64,       // Total successful check-ins logged so far
    pub created_at: u64,     // Ledger timestamp when habit was created
    pub last_checkin: u64,   // Ledger timestamp of the most recent check-in
    pub is_completed: bool,  // True when checkins >= frequency (goal achieved)
    pub is_abandoned: bool,  // True when user explicitly abandons the habit
}

#[contract]
pub struct HabitTrackerContract;

#[contractimpl]
impl HabitTrackerContract {

    // -----------------------------------------------------------------------
    // create_habit: Registers a new habit with a title, description, and
    // a target frequency (number of check-ins needed to complete it).
    // Returns the newly assigned habit_id.
    // -----------------------------------------------------------------------
    pub fn create_habit(env: Env, title: String, descrip: String, frequency: u64) -> u64 {
        // frequency must be at least 1
        if frequency == 0 {
            log!(&env, "Frequency must be at least 1");
            panic!("Frequency must be at least 1");
        }

        let mut count: u64 = env.storage().instance().get(&COUNT_HABIT).unwrap_or(0);
        count += 1;

        let time = env.ledger().timestamp();

        let habit = Habit {
            habit_id: count,
            title,
            descrip,
            frequency,
            checkins: 0,
            created_at: time,
            last_checkin: 0,
            is_completed: false,
            is_abandoned: false,
        };

        // Update global stats
        let mut stats = Self::view_all_stats(env.clone());
        stats.total += 1;
        stats.active += 1;

        // Persist
        env.storage().instance().set(&HabitBook::Habit(count), &habit);
        env.storage().instance().set(&ALL_HABIT, &stats);
        env.storage().instance().set(&COUNT_HABIT, &count);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "Habit created with ID: {}", count);
        count
    }

    // -----------------------------------------------------------------------
    // checkin_habit: Logs a check-in for an existing active habit.
    // Increments the check-in counter and marks the habit as completed
    // automatically when checkins reach the target frequency.
    // -----------------------------------------------------------------------
    pub fn checkin_habit(env: Env, habit_id: u64) {
        let mut habit = Self::view_habit(env.clone(), habit_id);

        if habit.habit_id == 0 {
            log!(&env, "Habit not found");
            panic!("Habit not found");
        }
        if habit.is_completed {
            log!(&env, "Habit is already completed!");
            panic!("Habit is already completed!");
        }
        if habit.is_abandoned {
            log!(&env, "Cannot check in: habit is abandoned");
            panic!("Cannot check in: habit is abandoned");
        }

        let time = env.ledger().timestamp();
        habit.checkins += 1;
        habit.last_checkin = time;

        let mut stats = Self::view_all_stats(env.clone());

        // Auto-complete when target frequency is reached
        if habit.checkins >= habit.frequency {
            habit.is_completed = true;
            stats.active -= 1;
            stats.completed += 1;
            log!(&env, "Habit ID: {} is now COMPLETED! Streak: {}", habit_id, habit.checkins);
        } else {
            log!(&env, "Check-in recorded for Habit ID: {}. Progress: {}/{}", habit_id, habit.checkins, habit.frequency);
        }

        env.storage().instance().set(&HabitBook::Habit(habit_id), &habit);
        env.storage().instance().set(&ALL_HABIT, &stats);
        env.storage().instance().extend_ttl(5000, 5000);
    }

    // -----------------------------------------------------------------------
    // abandon_habit: Lets a user mark a habit as abandoned.
    // Only active (non-completed, non-abandoned) habits can be abandoned.
    // -----------------------------------------------------------------------
    pub fn abandon_habit(env: Env, habit_id: u64) {
        let mut habit = Self::view_habit(env.clone(), habit_id);

        if habit.habit_id == 0 {
            log!(&env, "Habit not found");
            panic!("Habit not found");
        }
        if habit.is_completed {
            log!(&env, "Cannot abandon a completed habit");
            panic!("Cannot abandon a completed habit");
        }
        if habit.is_abandoned {
            log!(&env, "Habit is already abandoned");
            panic!("Habit is already abandoned");
        }

        habit.is_abandoned = true;

        let mut stats = Self::view_all_stats(env.clone());
        stats.active -= 1;
        stats.abandoned += 1;

        env.storage().instance().set(&HabitBook::Habit(habit_id), &habit);
        env.storage().instance().set(&ALL_HABIT, &stats);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "Habit ID: {} has been abandoned", habit_id);
    }

    // -----------------------------------------------------------------------
    // view_habit: Returns the full Habit struct for a given habit_id.
    // Returns a default (zeroed) Habit if the ID does not exist.
    // -----------------------------------------------------------------------
    pub fn view_habit(env: Env, habit_id: u64) -> Habit {
        let key = HabitBook::Habit(habit_id);
        env.storage().instance().get(&key).unwrap_or(Habit {
            habit_id: 0,
            title: String::from_str(&env, "Not_Found"),
            descrip: String::from_str(&env, "Not_Found"),
            frequency: 0,
            checkins: 0,
            created_at: 0,
            last_checkin: 0,
            is_completed: false,
            is_abandoned: false,
        })
    }

    // -----------------------------------------------------------------------
    // view_all_stats: Returns the aggregate HabitStats for the platform.
    // -----------------------------------------------------------------------
    pub fn view_all_stats(env: Env) -> HabitStats {
        env.storage().instance().get(&ALL_HABIT).unwrap_or(HabitStats {
            total: 0,
            active: 0,
            completed: 0,
            abandoned: 0,
        })
    }
}