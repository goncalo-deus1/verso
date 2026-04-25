// userQuiz.ts — Data access layer for the user_quiz table.
// One row per authenticated user; UPSERT replaces on conflict.

import { supabase } from '../supabase'
import type { QuizAnswers } from '../quiz/questions'
import type { QuizResult } from '../quiz/scoring'

export type UserQuiz = {
  user_id:    string
  answers:    QuizAnswers
  result:     QuizResult
  created_at: string
  updated_at: string
}

/** Fetch the saved quiz for a user. Returns null if none exists. */
export async function getUserQuiz(userId: string): Promise<UserQuiz | null> {
  const { data, error } = await supabase
    .from('user_quiz')
    .select('user_id, answers, result, created_at, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('[userQuiz] getUserQuiz error:', error.message)
    return null
  }

  return data as UserQuiz | null
}

/**
 * Upsert (insert or overwrite) the quiz for a user.
 * Uses ON CONFLICT (user_id) DO UPDATE via Supabase's upsert helper.
 */
export async function upsertUserQuiz(
  userId:  string,
  answers: QuizAnswers,
  result:  QuizResult,
): Promise<void> {
  const { error } = await supabase
    .from('user_quiz')
    .upsert(
      { user_id: userId, answers, result },
      { onConflict: 'user_id' },
    )

  if (error) {
    console.error('[userQuiz] upsertUserQuiz error:', error.message)
    throw error
  }
}

/**
 * Delete the saved quiz for a user.
 * Not exposed in the UI yet — kept for completeness / admin flows.
 */
export async function deleteUserQuiz(userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_quiz')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('[userQuiz] deleteUserQuiz error:', error.message)
    throw error
  }
}
