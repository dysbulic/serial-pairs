# Serial Pairs

This is a framework to support the organization of continual work on a project by scheduling a series of overlapping pair programming sessions. Adjacent pairs of developers have an overlap to allow the departing pair to commit all their work & brief the incoming pair of their progress. All work is both streamed and recorded. Participants recieve a base payment for being present for a session and recording a video. That compensation, however, can be more than doubled based on peer review performed either live or on the recording of the event.

The goal is to provide a resource for architects who have a reasonably well structured project description, but don't have the resources to build a development organization. Also, the recordings will capture the entire development process for the program, and, when combined with the review metadata should provide interested parties a live "blame" view of the author's thinking for each piece of code.

## Interfaces

There are three primary interfaces used to orchestrate the endeavor: scheduling, execution, and review.

### Scheduling

A session has at least two participants: the Navigator and the Driver. The Navigator described the code to be written while the Driver operates the keyboard. Pairs apply for sessions by providing a bid that includes:
* the time period they desire; both windows for start time and duration they would like the driver's seat
* a set of GitHub issues they intend to address
* an estimate of the progres they will make

The community selects which applicants fill slots via a token-gated voting interface where decisions are ratified in sync with a rolling window. There is a basic participation token that anyone can mint. Beyond that though there are muiltiplier tokens which increase voters' influence. A project has a single primary architect who has the ability to distribute tokens *(and convey the ability for someone else to distribute tokens)*. Tokens can be destroyed via collective action.

Five days in advance of a slot being worked, bids are chosen both for a worker and an on-call backup to take the session if the selected group doesn't make check-in.

### Execution

Once a session is slated to start, an hour before the intended start time, the pair have to check in and signal their continued intention to attempt to satify their bid. At the point they check in, they will recieve stream keys necessary to configure OBS to broadcast their session to the internet where it is captured.

The actual coding will be done via a Discord video chat for screen share, and sources shared using [CodeSandbox](https://codesandbox.io) which allows collaborative editing either in the browser or VS Code.

Once a pair's session starts there is an intial period where they join the previous pair's session. They get a brief of what progress was made, the departing team commits the state of their code, and summarizes their progress.

If the departing team is in the midst of a coding push that can be completed within a relatively short period, they can request an extension if the current team agrees to reconvene to do a merge.

### Review

A major component of compensation is based on input from a program that semantically breaks down the video into time periods of events like debugging or new development or testing. Periods when the pair goes off track are recorded as well as events like discovering a solution and writing code that doesn't conform to the syntax standards.

During their session the participants have access to the review interface. Also participants watching via the livestream and then those watching recordings.

As well as an objective description of the events, reviewers are also able to make subjective assessments: both descriptive statements and also weighted terms. It will also be possible to review reviews and rate the veracity of the reviewer.

Reviewers after the fact will have the option of watching the stream in an abbreviated mode where sections unimportant to the progress of development are sped up or skipped entierly.

## Technologies

* Livepeer will be used for steaming the sessions & capturing recordings.
* Ceramic will be used for storing review information.
* The FEVM will be used for an ERC-1155 deployed for token-based permissions.
* IPFS will be used for the storage of video streams.
* Postgresql will be used for querying bids to determine potential schedules.
