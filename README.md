# On Chain Habit Tracker

---

## Table of Contents

- [Project Title](#project-title)
- [Project Description](#project-description)
- [Project Vision](#project-vision)
- [Key Features](#key-features)
- [Future Scope](#future-scope)
- [Contract Functions](#contract-functions)
- [Data Structures](#data-structures)
- [Getting Started](#getting-started)

---

## Project Title

**On Chain Habit Tracker**

---

## Project Description

On Chain Habit Tracker is a decentralized habit-tracking application built on the **Stellar blockchain** using the **Soroban smart contract SDK**. It empowers users to commit to personal goals—exercise, reading, meditation, coding, hydration, and more—by recording every habit and every check-in immutably on-chain.

Unlike traditional habit-tracking apps that are siloed in centralized databases, this contract stores all habit data transparently on the Stellar ledger. Users create a habit with a title, a description, and a **target frequency** (the number of check-ins required to complete the habit). As they log daily or periodic check-ins, progress is updated on-chain in real time. When the target is met, the habit is automatically marked **Completed**. If a user decides to stop, they can mark it **Abandoned** — keeping the history honest and immutable.

A global stats dashboard tracks platform-wide numbers: total habits created, currently active habits, habits completed, and habits abandoned.

---

## Project Vision

The vision of On Chain Habit Tracker is to bring **accountability, transparency, and trust** to personal self-improvement through blockchain technology.

Traditional habit trackers rely on centralized servers and can be manipulated, deleted, or shut down. By putting habits on-chain:

- **Progress is tamper-proof** — no one can retroactively alter your check-in history.
- **Accountability is public** — your commitment is recorded on a global, verifiable ledger.
- **Ownership is yours** — your habit data is not harvested or monetized by a third party.
- **Incentives can be built on top** — future integrations can reward streaks with tokens, NFTs, or DAO governance rights.

The long-term vision is a **decentralized self-improvement ecosystem** where individuals, communities, and organizations can build verifiable track records of consistency and discipline.

---

## Key Features

| Feature | Description |
|---|---|
| **Create Habit** | Register any habit with a custom title, description, and target frequency (streak goal) |
| **Check-In** | Log a check-in for an active habit; progress is stored on-chain with a ledger timestamp |
| **Auto-Completion** | When check-ins reach the target frequency, the habit is automatically marked Completed |
| **Abandon Habit** | Users can honestly mark a habit as abandoned — keeping the ledger accurate |
| **View Habit** | Retrieve full details of any habit by its unique on-chain ID |
| **Platform Stats** | View aggregate stats: total, active, completed, and abandoned habits across the platform |
| **Immutable History** | All data lives on the Stellar blockchain — no central authority can alter records |
| **Lightweight & Gas-Efficient** | Only 4 core functions, optimised for low resource consumption on Soroban |

---

## Future Scope

The current contract is intentionally minimal and focused. Below are planned extensions for future versions:

1. **Wallet-Based Ownership**
   Associate each habit with the creator's Stellar wallet address, so only the owner can check in or abandon their own habits.

2. **Streak Rewards & Tokenization**
   Integrate with a native token or Stellar asset to automatically reward users who complete habits — creating financial incentives for consistency.

3. **Community Challenges**
   Allow groups of users to collectively commit to a shared habit. Track group progress and issue on-chain badges upon group completion.

4. **NFT Achievements**
   Mint Soroban-based NFTs as proof-of-completion trophies for significant habit milestones (e.g., 30-day streak, 100 check-ins).

5. **Reminder Oracle Integration**
   Connect an off-chain oracle or notification service that pings users when they haven't checked in within a user-defined window, bridging Web2 UX with Web3 accountability.

6. **Habit Categories & Tags**
   Add on-chain categorisation (Health, Learning, Finance, etc.) to enable filtered stats and leaderboards by category.

7. **Frontend dApp**
   Build a React/Next.js frontend that connects to a Stellar wallet (Freighter, xBull) and provides a clean dashboard UI powered entirely by this smart contract.

8. **DAO Governance**
   Introduce a governance mechanism where active, high-streak users earn voting rights to shape platform parameters (e.g., TTL settings, reward rates).

---

## Contract Functions

### `create_habit(env, title, descrip, frequency) → u64`
Creates a new habit on-chain. Returns the unique `habit_id`.
- `title` — Short name for the habit (e.g., `"Morning Run"`)
- `descrip` — Longer description or goal statement
- `frequency` — Target number of check-ins to complete the habit (must be ≥ 1)

### `checkin_habit(env, habit_id)`
Logs a check-in for an active habit. Automatically marks the habit **Completed** when `checkins >= frequency`. Panics if the habit is already completed or abandoned.

### `abandon_habit(env, habit_id)`
Marks an active habit as **Abandoned**. Cannot be applied to completed or already-abandoned habits.

### `view_habit(env, habit_id) → Habit`
Returns the full `Habit` struct for the given ID. Returns a zeroed default struct if the ID does not exist.

### `view_all_stats(env) → HabitStats`
Returns the global `HabitStats` object with platform-wide counts (total, active, completed, abandoned).

---

## Data Structures

### `Habit`
```rust
pub struct Habit {
    pub habit_id: u64,       // Unique on-chain identifier
    pub title: String,       // Habit title
    pub descrip: String,     // Habit description / goal
    pub frequency: u64,      // Target check-in count
    pub checkins: u64,       // Check-ins logged so far
    pub created_at: u64,     // Ledger timestamp of creation
    pub last_checkin: u64,   // Ledger timestamp of last check-in
    pub is_completed: bool,  // true when checkins >= frequency
    pub is_abandoned: bool,  // true when user abandons the habit
}
```

### `HabitStats`
```rust
pub struct HabitStats {
    pub total: u64,      // All habits ever created
    pub active: u64,     // Currently active habits
    pub completed: u64,  // Successfully completed habits
    pub abandoned: u64,  // Abandoned habits
}
```

---

## Getting Started

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install) with `wasm32-unknown-unknown` target
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- A funded Stellar testnet account

### Build
```bash
cargo build --target wasm32-unknown-unknown --release
```

### Deploy to Testnet
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/habit_tracker.wasm \
  --network testnet \
  --source <YOUR_SECRET_KEY>
```

### Example Invocations
```bash
# Create a habit with a 30-day streak target
soroban contract invoke --id <CONTRACT_ID> --network testnet \
  -- create_habit \
  --title "Morning Run" \
  --descrip "Run 5km every morning before 7am" \
  --frequency 30

# Log a check-in for habit ID 1
soroban contract invoke --id <CONTRACT_ID> --network testnet \
  -- checkin_habit --habit_id 1

# View habit details
soroban contract invoke --id <CONTRACT_ID> --network testnet \
  -- view_habit --habit_id 1

# View platform-wide stats
soroban contract invoke --id <CONTRACT_ID> --network testnet \
  -- view_all_stats
```

---

> Built with ❤️ using [Soroban SDK](https://soroban.stellar.org/) on the Stellar blockchain.


## Contract Details:
Contract ID: CANTK2B3XVOOUEU4YRWYFMOHSQGAAINHDVCAQEM7RPQD4HMZCL2MZQ4A
<img width="1912" height="868" alt="image" src="https://github.com/user-attachments/assets/ba371efb-6f6a-4239-a0b2-0062224e35bd" />
