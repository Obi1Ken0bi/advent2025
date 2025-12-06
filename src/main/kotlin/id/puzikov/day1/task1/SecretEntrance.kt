package id.puzikov.day1.task1


class Safe(
    initialPosition: Int = 50,
    private val dialSize: Int = 100
) {
    var currentPos: Int = initialPosition
        private set

    fun spin(direction: Direction, distance: Int): Int {
        currentPos = when (direction) {
            Direction.RIGHT -> (currentPos + distance) % dialSize
            Direction.LEFT -> (currentPos - distance % dialSize + dialSize) % dialSize
        }
        return currentPos
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
    val safe = Safe(initialPosition = 50, dialSize = 100)

    val input = object {}.javaClass
        .getResourceAsStream("input.txt")
        ?.bufferedReader()
        ?.useLines { lines -> lines.map(::parseInstruction).toList() }
        ?: error("Could not read input")
    println(input.map {
        safe.spin(it.direction, it.distance)
    }.count { it == 0 })
}