/**
 * LeetCode #1: Two Sum
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/two-sum/
 *
 * Description:
 * Given an array of integers nums and an integer target, return indices of the
 * two numbers such that they add up to target.
 *
 * You may assume that each input would have exactly one solution, and you may
 * not use the same element twice. You can return the answer in any order.
 *
 * Example 1:
 * Input: nums = [2,7,11,15], target = 9
 * Output: [0,1]
 * Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
 *
 * Example 2:
 * Input: nums = [3,2,4], target = 6
 * Output: [1,2]
 *
 * Example 3:
 * Input: nums = [3,3], target = 6
 * Output: [0,1]
 *
 * Constraints:
 * - 2 <= nums.length <= 10^4
 * - -10^9 <= nums[i] <= 10^9
 * - -10^9 <= target <= 10^9
 * - Only one valid answer exists
 */

import { TestRunner } from '../utils/test-runner';

/**
 * Solution: Using Hash Map
 * Time Complexity: O(n) - single pass through the array
 * Space Complexity: O(n) - hash map stores up to n elements
 *
 * Algorithm:
 * 1. Create a hash map to store number -> index mapping
 * 2. For each number in the array:
 *    a. Calculate complement = target - current number
 *    b. If complement exists in map, return [map[complement], current index]
 *    c. Otherwise, store current number and index in map
 * 3. Continue until solution is found
 */
export function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  // Should never reach here based on problem constraints
  return [];
}

// Test cases
if (require.main === module) {
  const runner = new TestRunner<{ nums: number[]; target: number }, number[]>(
    'Two Sum'
  );

  runner.addTest(
    { nums: [2, 7, 11, 15], target: 9 },
    [0, 1],
    'Example 1: Basic case, target found at beginning'
  );

  runner.addTest(
    { nums: [3, 2, 4], target: 6 },
    [1, 2],
    'Example 2: Target found at middle'
  );

  runner.addTest(
    { nums: [3, 3], target: 6 },
    [0, 1],
    'Example 3: Duplicate numbers'
  );

  // Edge cases
  runner.addTest(
    { nums: [-1, -2, -3, -4, -5], target: -8 },
    [2, 4],
    'Edge case: Negative numbers'
  );

  runner.addTest(
    { nums: [0, 4, 3, 0], target: 0 },
    [0, 3],
    'Edge case: Zero values'
  );

  runner.addTest(
    { nums: [-3, 4, 3, 90], target: 0 },
    [0, 2],
    'Edge case: Negative and positive numbers'
  );

  runner.run(({ nums, target }) => twoSum(nums, target));
}
