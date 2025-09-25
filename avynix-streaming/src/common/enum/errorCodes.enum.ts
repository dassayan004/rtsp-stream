export enum MongoErrorCode {
  DuplicateKey = 11000, // Duplicate key error
  DocumentNotFound = 66, // Document not found (rare, mostly for write concern)
  ValidationFailed = 121, // Document validation failed
  WriteConflict = 112, // Write conflict during replication
  ExceededTimeLimit = 50, // Operation exceeded time limit
}
