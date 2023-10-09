def find_nearest_neighbours(positions, N):
    neighbours = {}
    for i in range(N):
        distances = np.linalg.norm(positions - positions[i], axis=1)
        neighbour_indices = np.where(distances < 1 + 2)[0]
        neighbour_indices = neighbour_indices[neighbour_indices != i]
        neighbours[i] = list(neighbour_indices)
    return neighbours