package id.puzikov.day1.task2


class ZeroCountingSafe(
    initialPosition: Int = 50,
    private val dialSize: Int = 100
) {
    var currentPos: Int = initialPosition
        private set

    var zeroCrossings: Int = 0
        private set

    fun spin(direction: Direction, distance: Int): Int {
        zeroCrossings += countZeroCrossings(direction, distance)

        currentPos = when (direction) {
            Direction.RIGHT -> (currentPos + distance) % dialSize
            Direction.LEFT -> (currentPos - distance % dialSize + dialSize) % dialSize
        }
        return currentPos
    }

    private fun countZeroCrossings(direction: Direction, distance: Int): Int {
        return when (direction) {
            Direction.RIGHT -> (currentPos + distance) / dialSize
            Direction.LEFT -> when {
                currentPos == 0 -> distance / dialSize
                distance >= currentPos -> 1 + (distance - currentPos) / dialSize
                else -> 0
            }
        }
    }
}

enum class Direction {
    LEFT,
    RIGHT;

    companion object {
        fun fromChar(c: Char): Direction = when (c) {
            'L' -> LEFT
            'R' -> RIGHT
            else -> throw IllegalArgumentException("Unknown direction: $c")
        }
    }
}

data class Instruction(val direction: Direction, val distance: Int)

fun parseInstruction(input: String): Instruction {
    val trimmed = input.trim()
    return Instruction(
        direction = Direction.fromChar(trimmed.first()),
        distance = trimmed.drop(1).toInt()
    )
}

fun main() {
    val zeroCountingSafe = ZeroCountingSafe(initialPosition = 50, dialSize = 100)

    val input = object {}.javaClass
        .getResourceAsStream("input.txt")
        ?.bufferedReader()
        ?.useLines { lines -> lines.map(::parseInstruction).toList() }
        ?: error("Could not read input")
    input.forEach {
        zeroCountingSafe.spin(it.direction, it.distance)
        println("Spun ${it.direction} by ${it.distance}, current position: ${zeroCountingSafe.currentPos}, zero count: ${zeroCountingSafe.zeroCrossings}")
    }
    println(zeroCountingSafe.zeroCrossings)
}